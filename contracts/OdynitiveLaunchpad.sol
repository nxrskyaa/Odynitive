// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @notice Thrown when an address argument must not be the zero address.
error ZeroAddress();
error ZeroAmount();
error InvalidMetadata();
error MarketNotFound();
error SlippageExceeded();
error FeeTooHigh();
error PageTooLarge();
error NotOwner();
error NotTreasury();
error NothingToWithdraw();
error InsufficientBalance();
error InsufficientAllowance();
error InsufficientLiquidity();
error NativeTransferFailed();
error ReentrantCall();

/**
 * @title OdynitiveToken
 * @notice Minimal fixed-supply ERC-20 deployed and fully escrowed by OdynitiveFactory.
 * @dev Self-contained so this entire source can be compiled directly in Remix.
 */
contract OdynitiveToken {
    string public name;
    string public symbol;
    string public metadataURI;
    uint8 public constant decimals = 18;
    uint256 public immutable totalSupply;
    address public immutable factory;

    mapping(address account => uint256 amount) public balanceOf;
    mapping(address owner => mapping(address spender => uint256 amount)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory metadataURI_,
        uint256 supply_,
        address factory_
    ) {
        if (factory_ == address(0)) revert ZeroAddress();
        name = name_;
        symbol = symbol_;
        metadataURI = metadataURI_;
        totalSupply = supply_;
        factory = factory_;
        balanceOf[factory_] = supply_;
        emit Transfer(address(0), factory_, supply_);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 permitted = allowance[from][msg.sender];
        if (permitted < amount) revert InsufficientAllowance();
        if (permitted != type(uint256).max) {
            unchecked {
                allowance[from][msg.sender] = permitted - amount;
            }
            emit Approval(from, msg.sender, allowance[from][msg.sender]);
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) private {
        if (to == address(0)) revert ZeroAddress();
        uint256 fromBalance = balanceOf[from];
        if (fromBalance < amount) revert InsufficientBalance();
        unchecked {
            balanceOf[from] = fromBalance - amount;
            balanceOf[to] += amount;
        }
        emit Transfer(from, to, amount);
    }
}

/**
 * @title OdynitiveFactory
 * @notice Fixed-supply token factory and virtual-reserve constant-product launchpad.
 * @author nxrskyaa
 */
contract OdynitiveFactory {
    string public constant BUILDER = "nxrskyaa";
    address public immutable BUILDER_ADDRESS;

    uint256 public constant TOKEN_SUPPLY = 1_000_000_000 ether;
    uint256 public constant INITIAL_VIRTUAL_NATIVE_RESERVE = 10_000 ether;
    uint256 public constant INITIAL_VIRTUAL_TOKEN_RESERVE = TOKEN_SUPPLY;
    uint16 public constant BPS_DENOMINATOR = 10_000;
    uint16 public constant MAX_TOTAL_FEE_BPS = 1_000;
    uint256 public constant MAX_PAGE_SIZE = 100;

    struct Market {
        address token;
        address creator;
        string name;
        string symbol;
        string description;
        string imageURI;
        string website;
        string social;
        uint256 virtualRitualReserve;
        uint256 virtualTokenReserve;
        uint256 realRitualReserve;
        uint256 tokensSold;
        uint256 totalVolume;
        uint256 createdAt;
        uint256 tradeCount;
        bool active;
    }

    address public owner;
    address public protocolTreasury;
    uint16 public protocolFeeBps = 100;
    uint16 public creatorFeeBps = 50;
    uint256 public protocolFeesAccrued;
    mapping(address creator => uint256 amount) public creatorFeesAccrued;

    mapping(address token => Market market) private _markets;
    address[] private _marketTokens;
    uint256 private _reentrancyState = 1;

    event TokenLaunched(
        address indexed token,
        address indexed creator,
        string name,
        string symbol,
        uint256 indexed marketIndex
    );
    event TokensBought(
        address indexed token,
        address indexed buyer,
        uint256 nativeIn,
        uint256 tokenOut,
        uint256 protocolFee,
        uint256 creatorFee
    );
    event TokensSold(
        address indexed token,
        address indexed seller,
        uint256 tokenIn,
        uint256 nativeOut,
        uint256 protocolFee,
        uint256 creatorFee
    );
    event FeesUpdated(
        uint16 oldProtocolFeeBps,
        uint16 oldCreatorFeeBps,
        uint16 newProtocolFeeBps,
        uint16 newCreatorFeeBps
    );
    event ProtocolTreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event ProtocolFeesWithdrawn(address indexed treasury, uint256 amount);
    event CreatorFeesWithdrawn(address indexed creator, uint256 amount);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier nonReentrant() {
        if (_reentrancyState != 1) revert ReentrantCall();
        _reentrancyState = 2;
        _;
        _reentrancyState = 1;
    }

    constructor(address protocolTreasury_) {
        if (protocolTreasury_ == address(0)) revert ZeroAddress();
        owner = msg.sender;
        BUILDER_ADDRESS = msg.sender;
        protocolTreasury = protocolTreasury_;
        emit OwnershipTransferred(address(0), msg.sender);
        emit ProtocolTreasuryUpdated(address(0), protocolTreasury_);
    }

    /**
     * @notice Launches a new fixed-supply token and initializes its virtual curve.
     */
    function launchToken(
        string calldata name,
        string calldata symbol,
        string calldata description,
        string calldata imageURI,
        string calldata website,
        string calldata socialLink
    ) external nonReentrant returns (address tokenAddress) {
        _validateMetadata(name, symbol, description, imageURI, website, socialLink);

        OdynitiveToken token = new OdynitiveToken(
            name,
            symbol,
            imageURI,
            TOKEN_SUPPLY,
            address(this)
        );
        tokenAddress = address(token);
        uint256 marketIndex = _marketTokens.length;

        _markets[tokenAddress] = Market({
            token: tokenAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            description: description,
            imageURI: imageURI,
            website: website,
            social: socialLink,
            virtualRitualReserve: INITIAL_VIRTUAL_NATIVE_RESERVE,
            virtualTokenReserve: INITIAL_VIRTUAL_TOKEN_RESERVE,
            realRitualReserve: 0,
            tokensSold: 0,
            totalVolume: 0,
            createdAt: block.timestamp,
            tradeCount: 0,
            active: true
        });
        _marketTokens.push(tokenAddress);

        emit TokenLaunched(tokenAddress, msg.sender, name, symbol, marketIndex);
    }

    /**
     * @notice Returns the exact current buy quote, including both fee components.
     */
    function quoteBuy(address token, uint256 nativeIn)
        public
        view
        returns (uint256 tokenOut, uint256 protocolFee, uint256 creatorFee)
    {
        Market storage market = _requireMarket(token);
        if (nativeIn == 0) revert ZeroAmount();
        (protocolFee, creatorFee) = _fees(nativeIn);
        uint256 netIn = nativeIn - protocolFee - creatorFee;
        tokenOut = market.virtualTokenReserve * netIn /
            (market.virtualRitualReserve + netIn);
        if (tokenOut == 0) revert ZeroAmount();
    }

    /**
     * @notice Buys tokens with native RITUAL while enforcing a minimum output.
     */
    function buy(address token, uint256 minTokensOut)
        external
        payable
        nonReentrant
        returns (uint256 tokenOut)
    {
        Market storage market = _requireMarket(token);
        if (msg.value == 0) revert ZeroAmount();

        uint256 protocolFee;
        uint256 creatorFee;
        (tokenOut, protocolFee, creatorFee) = quoteBuy(token, msg.value);
        if (tokenOut < minTokensOut) revert SlippageExceeded();

        uint256 netIn = msg.value - protocolFee - creatorFee;
        market.virtualRitualReserve += netIn;
        market.virtualTokenReserve -= tokenOut;
        market.realRitualReserve += netIn;
        market.tokensSold += tokenOut;
        market.totalVolume += msg.value;
        market.tradeCount += 1;
        protocolFeesAccrued += protocolFee;
        creatorFeesAccrued[market.creator] += creatorFee;

        if (!OdynitiveToken(token).transfer(msg.sender, tokenOut)) revert InsufficientLiquidity();
        emit TokensBought(token, msg.sender, msg.value, tokenOut, protocolFee, creatorFee);
    }

    /**
     * @notice Returns the exact current sell quote after protocol and creator fees.
     */
    function quoteSell(address token, uint256 tokenIn)
        public
        view
        returns (uint256 nativeOut, uint256 protocolFee, uint256 creatorFee)
    {
        Market storage market = _requireMarket(token);
        if (tokenIn == 0) revert ZeroAmount();
        uint256 grossNativeOut = market.virtualRitualReserve * tokenIn /
            (market.virtualTokenReserve + tokenIn);
        if (grossNativeOut == 0) revert ZeroAmount();
        (protocolFee, creatorFee) = _fees(grossNativeOut);
        nativeOut = grossNativeOut - protocolFee - creatorFee;
    }

    /**
     * @notice Sells tokens into their curve while enforcing a minimum native output.
     */
    function sell(address token, uint256 tokenIn, uint256 minNativeOut)
        external
        nonReentrant
        returns (uint256 nativeOut)
    {
        Market storage market = _requireMarket(token);
        if (tokenIn == 0) revert ZeroAmount();

        uint256 protocolFee;
        uint256 creatorFee;
        (nativeOut, protocolFee, creatorFee) = quoteSell(token, tokenIn);
        if (nativeOut < minNativeOut) revert SlippageExceeded();
        uint256 grossNativeOut = nativeOut + protocolFee + creatorFee;
        if (market.realRitualReserve < grossNativeOut) revert InsufficientLiquidity();
        if (OdynitiveToken(token).allowance(msg.sender, address(this)) < tokenIn) {
            revert InsufficientAllowance();
        }

        if (!OdynitiveToken(token).transferFrom(msg.sender, address(this), tokenIn)) {
            revert InsufficientBalance();
        }

        market.virtualRitualReserve -= grossNativeOut;
        market.virtualTokenReserve += tokenIn;
        market.realRitualReserve -= grossNativeOut;
        market.tokensSold -= tokenIn;
        market.totalVolume += grossNativeOut;
        market.tradeCount += 1;
        protocolFeesAccrued += protocolFee;
        creatorFeesAccrued[market.creator] += creatorFee;

        (bool sent, ) = payable(msg.sender).call{value: nativeOut}("");
        if (!sent) revert NativeTransferFailed();
        emit TokensSold(token, msg.sender, tokenIn, nativeOut, protocolFee, creatorFee);
    }

    function withdrawProtocolFees() external nonReentrant {
        if (msg.sender != protocolTreasury) revert NotTreasury();
        uint256 amount = protocolFeesAccrued;
        if (amount == 0) revert NothingToWithdraw();
        protocolFeesAccrued = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        if (!sent) revert NativeTransferFailed();
        emit ProtocolFeesWithdrawn(msg.sender, amount);
    }

    function withdrawCreatorFees() external nonReentrant {
        uint256 amount = creatorFeesAccrued[msg.sender];
        if (amount == 0) revert NothingToWithdraw();
        creatorFeesAccrued[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        if (!sent) revert NativeTransferFailed();
        emit CreatorFeesWithdrawn(msg.sender, amount);
    }

    function setFees(uint16 newProtocolFeeBps, uint16 newCreatorFeeBps) external onlyOwner {
        if (uint256(newProtocolFeeBps) + uint256(newCreatorFeeBps) > MAX_TOTAL_FEE_BPS) {
            revert FeeTooHigh();
        }
        emit FeesUpdated(
            protocolFeeBps,
            creatorFeeBps,
            newProtocolFeeBps,
            newCreatorFeeBps
        );
        protocolFeeBps = newProtocolFeeBps;
        creatorFeeBps = newCreatorFeeBps;
    }

    function setProtocolTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddress();
        emit ProtocolTreasuryUpdated(protocolTreasury, newTreasury);
        protocolTreasury = newTreasury;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function marketCount() external view returns (uint256) {
        return _marketTokens.length;
    }

    function marketAt(uint256 index) external view returns (address) {
        return _marketTokens[index];
    }

    function getMarket(address token) external view returns (Market memory) {
        Market storage market = _requireMarket(token);
        return market;
    }

    /**
     * @notice Returns at most 100 markets, beginning at offset.
     * @dev An offset at or beyond the end returns an empty array.
     */
    function getMarkets(uint256 offset, uint256 limit) external view returns (Market[] memory page) {
        if (limit > MAX_PAGE_SIZE) revert PageTooLarge();
        uint256 count = _marketTokens.length;
        if (offset >= count || limit == 0) return new Market[](0);
        uint256 end = offset + limit;
        if (end > count) end = count;
        page = new Market[](end - offset);
        for (uint256 i; i < page.length; ) {
            page[i] = _markets[_marketTokens[offset + i]];
            unchecked {
                ++i;
            }
        }
    }

    function _requireMarket(address token) private view returns (Market storage market) {
        market = _markets[token];
        if (market.token == address(0)) revert MarketNotFound();
    }

    function _fees(uint256 amount) private view returns (uint256 protocolFee, uint256 creatorFee) {
        protocolFee = amount * protocolFeeBps / BPS_DENOMINATOR;
        creatorFee = amount * creatorFeeBps / BPS_DENOMINATOR;
    }

    function _validateMetadata(
        string calldata name,
        string calldata symbol,
        string calldata description,
        string calldata imageURI,
        string calldata website,
        string calldata socialLink
    ) private pure {
        uint256 nameLength = bytes(name).length;
        uint256 symbolLength = bytes(symbol).length;
        uint256 descriptionLength = bytes(description).length;
        uint256 imageLength = bytes(imageURI).length;
        if (
            nameLength == 0 || nameLength > 64 ||
            symbolLength == 0 || symbolLength > 16 ||
            descriptionLength == 0 || descriptionLength > 512 ||
            imageLength == 0 || imageLength > 256 ||
            bytes(website).length > 256 ||
            bytes(socialLink).length > 256
        ) revert InvalidMetadata();
    }
}
