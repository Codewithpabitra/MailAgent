require("dotenv").config();
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Wallet balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("❌ No ETH in wallet! Get testnet ETH from faucet.base.org");
    return;
  }

  const priceInWei = hre.ethers.parseEther("0.0001");
  console.log("Deploying MailPayment contract...");

  const MailPayment = await hre.ethers.getContractFactory("MailPayment");
  const contract = await MailPayment.deploy(priceInWei);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed to:", address);
  console.log("👉 Copy this into your .env as CONTRACT_ADDRESS=", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
});