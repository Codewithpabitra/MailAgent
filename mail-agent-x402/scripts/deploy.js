require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const priceInWei = hre.ethers.parseEther("0.0001");
  const MailPayment = await hre.ethers.getContractFactory("MailPayment");
  const contract = await MailPayment.deploy(priceInWei);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ Contract deployed to:", address);
}

main().catch(console.error);