import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

const SUPPLY = ethers.parseEther("1000000000");
const VIRTUAL_NATIVE = ethers.parseEther("10000");
const BPS = 10_000n;

function buyQuote(nativeIn: bigint, protocolBps = 100n, creatorBps = 50n) {
  const protocolFee = nativeIn * protocolBps / BPS;
  const creatorFee = nativeIn * creatorBps / BPS;
  const netIn = nativeIn - protocolFee - creatorFee;
  const tokenOut = SUPPLY * netIn / (VIRTUAL_NATIVE + netIn);
  return { tokenOut, protocolFee, creatorFee, netIn };
}

async function deployFixture() {
  const [owner, treasury, creator, buyer, other] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("OdynitiveFactory");
  const factory = await Factory.deploy(treasury.address);
  await factory.waitForDeployment();
  return { factory, owner, treasury, creator, buyer, other };
}

async function launchedFixture() {
  const base = await deployFixture();
  const tx = await base.factory.connect(base.creator).launchToken(
    "Odynitive One", "ODY", "A launchpad token", "ipfs://image", "https://odynitive.xyz", "https://x.com/odynitive"
  );
  const receipt = await tx.wait();
  const event = receipt!.logs.map((log) => {
    try { return base.factory.interface.parseLog(log); } catch { return null; }
  }).find((parsed) => parsed?.name === "TokenLaunched");
  const tokenAddress = event!.args.token as string;
  const token = await ethers.getContractAt("OdynitiveToken", tokenAddress);
  return { ...base, tokenAddress, token };
}

describe("OdynitiveFactory", function () {
  describe("identity and administration", function () {
    it("records the builder identity, deployer, treasury, and default fees", async function () {
      const { factory, owner, treasury } = await loadFixture(deployFixture);
      expect(await factory.BUILDER()).to.equal("nxrskyaa");
      expect(await factory.BUILDER_ADDRESS()).to.equal(owner.address);
      expect(await factory.owner()).to.equal(owner.address);
      expect(await factory.protocolTreasury()).to.equal(treasury.address);
      expect(await factory.protocolFeeBps()).to.equal(100);
      expect(await factory.creatorFeeBps()).to.equal(50);
    });

    it("rejects a zero treasury", async function () {
      const Factory = await ethers.getContractFactory("OdynitiveFactory");
      await expect(Factory.deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(Factory, "ZeroAddress");
    });

    it("lets only the owner configure bounded fees", async function () {
      const { factory, owner, other } = await loadFixture(deployFixture);
      await expect(factory.connect(other).setFees(200, 100)).to.be.revertedWithCustomError(factory, "NotOwner");
      await expect(factory.connect(owner).setFees(700, 301)).to.be.revertedWithCustomError(factory, "FeeTooHigh");
      await expect(factory.connect(owner).setFees(200, 100)).to.emit(factory, "FeesUpdated").withArgs(100, 50, 200, 100);
      expect(await factory.protocolFeeBps()).to.equal(200);
      expect(await factory.creatorFeeBps()).to.equal(100);
    });

    it("lets only the owner update treasury and transfer ownership", async function () {
      const { factory, owner, treasury, other } = await loadFixture(deployFixture);
      await expect(factory.connect(other).setProtocolTreasury(other.address)).to.be.revertedWithCustomError(factory, "NotOwner");
      await expect(factory.connect(owner).setProtocolTreasury(ethers.ZeroAddress)).to.be.revertedWithCustomError(factory, "ZeroAddress");
      await expect(factory.connect(owner).setProtocolTreasury(other.address)).to.emit(factory, "ProtocolTreasuryUpdated").withArgs(treasury.address, other.address);
      await expect(factory.connect(owner).transferOwnership(other.address)).to.emit(factory, "OwnershipTransferred").withArgs(owner.address, other.address);
      expect(await factory.owner()).to.equal(other.address);
    });
  });

  describe("launches", function () {
    it("deploys a fixed-supply ERC20, escrows supply, and stores all metadata", async function () {
      const { factory, creator, token, tokenAddress } = await loadFixture(launchedFixture);
      expect(await token.name()).to.equal("Odynitive One");
      expect(await token.symbol()).to.equal("ODY");
      expect(await token.decimals()).to.equal(18);
      expect(await token.totalSupply()).to.equal(SUPPLY);
      expect(await token.balanceOf(await factory.getAddress())).to.equal(SUPPLY);
      expect(await token.metadataURI()).to.equal("ipfs://image");
      expect(await token.factory()).to.equal(await factory.getAddress());

      const market = await factory.getMarket(tokenAddress);
      expect(market.token).to.equal(tokenAddress);
      expect(market.creator).to.equal(creator.address);
      expect(market.description).to.equal("A launchpad token");
      expect(market.imageURI).to.equal("ipfs://image");
      expect(market.website).to.equal("https://odynitive.xyz");
      expect(market.name).to.equal("Odynitive One");
      expect(market.symbol).to.equal("ODY");
      expect(market.social).to.equal("https://x.com/odynitive");
      expect(market.virtualRitualReserve).to.equal(VIRTUAL_NATIVE);
      expect(market.virtualTokenReserve).to.equal(SUPPLY);
      expect(market.realRitualReserve).to.equal(0);
      expect(market.tokensSold).to.equal(0);
      expect(market.tradeCount).to.equal(0);
      expect(market.active).to.equal(true);
      expect(await factory.marketCount()).to.equal(1);
    });

    it("emits the launch identity and index", async function () {
      const { factory, creator } = await loadFixture(deployFixture);
      await expect(factory.connect(creator).launchToken("Token", "TKN", "desc", "ipfs://img", "", ""))
        .to.emit(factory, "TokenLaunched")
        .withArgs(anyValue, creator.address, "Token", "TKN", 0);
    });

    it("rejects empty and overlong metadata", async function () {
      const { factory, creator } = await loadFixture(deployFixture);
      const launch = (name: string, symbol: string, description = "d", image = "i", website = "", social = "") =>
        factory.connect(creator).launchToken(name, symbol, description, image, website, social);
      await expect(launch("", "TKN")).to.be.revertedWithCustomError(factory, "InvalidMetadata");
      await expect(launch("Token", "")).to.be.revertedWithCustomError(factory, "InvalidMetadata");
      await expect(launch("x".repeat(65), "TKN")).to.be.revertedWithCustomError(factory, "InvalidMetadata");
      await expect(launch("Token", "x".repeat(17))).to.be.revertedWithCustomError(factory, "InvalidMetadata");
      await expect(launch("Token", "TKN", "x".repeat(513))).to.be.revertedWithCustomError(factory, "InvalidMetadata");
      await expect(launch("Token", "TKN", "d", "x".repeat(257))).to.be.revertedWithCustomError(factory, "InvalidMetadata");
    });

    it("paginates markets without reverting past the end", async function () {
      const { factory, creator } = await loadFixture(deployFixture);
      for (let i = 0; i < 3; i++) {
        await factory.connect(creator).launchToken(`Token ${i}`, `T${i}`, "d", `ipfs://${i}`, "", "");
      }
      const page = await factory.getMarkets(1, 5);
      expect(page).to.have.length(2);
      expect(page[0].description).to.equal("d");
      expect(await factory.getMarkets(3, 10)).to.have.length(0);
      expect(await factory.getMarkets(99, 10)).to.have.length(0);
      await expect(factory.getMarkets(0, 101)).to.be.revertedWithCustomError(factory, "PageTooLarge");
    });
  });

  describe("buying", function () {
    it("quotes exact curve output and explicit fees", async function () {
      const { factory, tokenAddress } = await loadFixture(launchedFixture);
      const amount = ethers.parseEther("10");
      const expected = buyQuote(amount);
      const quote = await factory.quoteBuy(tokenAddress, amount);
      expect(quote.tokenOut).to.equal(expected.tokenOut);
      expect(quote.protocolFee).to.equal(expected.protocolFee);
      expect(quote.creatorFee).to.equal(expected.creatorFee);
    });

    it("executes the quote, updates reserves, and accrues fees", async function () {
      const { factory, creator, buyer, token, tokenAddress } = await loadFixture(launchedFixture);
      const amount = ethers.parseEther("10");
      const q = buyQuote(amount);
      await expect(factory.connect(buyer).buy(tokenAddress, q.tokenOut, { value: amount }))
        .to.emit(factory, "TokensBought")
        .withArgs(tokenAddress, buyer.address, amount, q.tokenOut, q.protocolFee, q.creatorFee);
      expect(await token.balanceOf(buyer.address)).to.equal(q.tokenOut);
      const market = await factory.getMarket(tokenAddress);
      expect(market.virtualRitualReserve).to.equal(VIRTUAL_NATIVE + q.netIn);
      expect(market.virtualTokenReserve).to.equal(SUPPLY - q.tokenOut);
      expect(market.realRitualReserve).to.equal(q.netIn);
      expect(market.tokensSold).to.equal(q.tokenOut);
      expect(market.tradeCount).to.equal(1);
      expect(await factory.protocolFeesAccrued()).to.equal(q.protocolFee);
      expect(await factory.creatorFeesAccrued(creator.address)).to.equal(q.creatorFee);
    });

    it("rejects zero value, unknown markets, and slippage", async function () {
      const { factory, buyer, tokenAddress, other } = await loadFixture(launchedFixture);
      await expect(factory.connect(buyer).buy(tokenAddress, 0)).to.be.revertedWithCustomError(factory, "ZeroAmount");
      await expect(factory.connect(buyer).buy(other.address, 0, { value: 1 })).to.be.revertedWithCustomError(factory, "MarketNotFound");
      const quote = await factory.quoteBuy(tokenAddress, ethers.parseEther("1"));
      await expect(factory.connect(buyer).buy(tokenAddress, quote.tokenOut + 1n, { value: ethers.parseEther("1") }))
        .to.be.revertedWithCustomError(factory, "SlippageExceeded");
    });
  });

  describe("selling", function () {
    it("quotes and executes a sell against the updated virtual reserves", async function () {
      const { factory, creator, buyer, token, tokenAddress } = await loadFixture(launchedFixture);
      const buyAmount = ethers.parseEther("100");
      const bought = buyQuote(buyAmount);
      await factory.connect(buyer).buy(tokenAddress, bought.tokenOut, { value: buyAmount });
      const sellAmount = bought.tokenOut / 2n;
      const gross = (VIRTUAL_NATIVE + bought.netIn) * sellAmount / (SUPPLY - bought.tokenOut + sellAmount);
      const protocolFee = gross * 100n / BPS;
      const creatorFee = gross * 50n / BPS;
      const nativeOut = gross - protocolFee - creatorFee;
      const quote = await factory.quoteSell(tokenAddress, sellAmount);
      expect(quote.nativeOut).to.equal(nativeOut);
      expect(quote.protocolFee).to.equal(protocolFee);
      expect(quote.creatorFee).to.equal(creatorFee);

      await token.connect(buyer).approve(await factory.getAddress(), sellAmount);
      const before = await ethers.provider.getBalance(buyer.address);
      const tx = await factory.connect(buyer).sell(tokenAddress, sellAmount, nativeOut);
      const receipt = await tx.wait();
      const gas = receipt!.gasUsed * receipt!.gasPrice;
      expect(await ethers.provider.getBalance(buyer.address)).to.equal(before + nativeOut - gas);
      await expect(tx).to.emit(factory, "TokensSold").withArgs(tokenAddress, buyer.address, sellAmount, nativeOut, protocolFee, creatorFee);
      expect(await token.balanceOf(buyer.address)).to.equal(bought.tokenOut - sellAmount);
      expect(await factory.protocolFeesAccrued()).to.equal(bought.protocolFee + protocolFee);
      expect(await factory.creatorFeesAccrued(creator.address)).to.equal(bought.creatorFee + creatorFee);
    });

    it("rejects zero, unknown market, slippage, and missing allowance", async function () {
      const { factory, buyer, other, tokenAddress } = await loadFixture(launchedFixture);
      await expect(factory.quoteSell(tokenAddress, 0)).to.be.revertedWithCustomError(factory, "ZeroAmount");
      await expect(factory.connect(buyer).sell(other.address, 1, 0)).to.be.revertedWithCustomError(factory, "MarketNotFound");
      const bought = buyQuote(ethers.parseEther("1"));
      await factory.connect(buyer).buy(tokenAddress, bought.tokenOut, { value: ethers.parseEther("1") });
      const quote = await factory.quoteSell(tokenAddress, bought.tokenOut);
      await expect(factory.connect(buyer).sell(tokenAddress, bought.tokenOut, quote.nativeOut + 1n))
        .to.be.revertedWithCustomError(factory, "SlippageExceeded");
      await expect(factory.connect(buyer).sell(tokenAddress, bought.tokenOut, 0)).to.be.revertedWithCustomError(factory, "InsufficientAllowance");
    });
  });

  describe("pull withdrawals", function () {
    it("allows only treasury to pull protocol fees and follows treasury updates", async function () {
      const { factory, owner, treasury, buyer, other, tokenAddress } = await loadFixture(launchedFixture);
      const amount = ethers.parseEther("10");
      const q = buyQuote(amount);
      await factory.connect(buyer).buy(tokenAddress, 0, { value: amount });
      await expect(factory.connect(other).withdrawProtocolFees()).to.be.revertedWithCustomError(factory, "NotTreasury");
      await expect(factory.connect(treasury).withdrawProtocolFees()).to.changeEtherBalances([factory, treasury], [-q.protocolFee, q.protocolFee]);
      expect(await factory.protocolFeesAccrued()).to.equal(0);
      await expect(factory.connect(treasury).withdrawProtocolFees()).to.be.revertedWithCustomError(factory, "NothingToWithdraw");
      await factory.connect(owner).setProtocolTreasury(other.address);
      expect(await factory.protocolTreasury()).to.equal(other.address);
    });

    it("allows creators to pull only their own accrued fees", async function () {
      const { factory, creator, buyer, other, tokenAddress } = await loadFixture(launchedFixture);
      const amount = ethers.parseEther("10");
      const q = buyQuote(amount);
      await factory.connect(buyer).buy(tokenAddress, 0, { value: amount });
      await expect(factory.connect(other).withdrawCreatorFees()).to.be.revertedWithCustomError(factory, "NothingToWithdraw");
      await expect(factory.connect(creator).withdrawCreatorFees()).to.changeEtherBalances([factory, creator], [-q.creatorFee, q.creatorFee]);
      expect(await factory.creatorFeesAccrued(creator.address)).to.equal(0);
    });
  });
});
