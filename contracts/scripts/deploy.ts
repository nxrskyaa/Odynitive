import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(`Deployer: ${deployer.address}`)
  console.log(`Balance: ${ethers.formatEther(balance)} RITUAL`)
  const Factory = await ethers.getContractFactory('OdynitiveFactory')
  const factory = await Factory.deploy(deployer.address)
  const deployment = factory.deploymentTransaction()
  console.log(`Transaction: ${deployment?.hash}`)
  await factory.waitForDeployment()
  console.log(`Factory: ${await factory.getAddress()}`)
  console.log(`Builder: ${await factory.BUILDER()}`)
  console.log(`Builder address: ${await factory.BUILDER_ADDRESS()}`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
