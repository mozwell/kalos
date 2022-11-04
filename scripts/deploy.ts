import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const MAX_TOTAL_ARTWORKS = 9999;
  const MAX_PERSONAL_ARTWORKS = 10;
  const MAX_DEPLOYER_ARTWORKS = 10;

  const Contract = await ethers.getContractFactory("Kalos");

  const gasPrice = await Contract.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);
  const estimatedGas = await Contract.signer.estimateGas(
    Contract.getDeployTransaction(
      MAX_TOTAL_ARTWORKS,
      MAX_PERSONAL_ARTWORKS,
      MAX_DEPLOYER_ARTWORKS
    )
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await Contract.signer.getBalance();
  console.log(
    `Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`
  );
  console.log(
    `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`
  );

  if (Number(deployerBalance) < Number(deploymentPrice)) {
    throw new Error("You dont have enough balance to deploy.");
  }

  const contractInstance = await Contract.deploy(
    MAX_TOTAL_ARTWORKS,
    MAX_PERSONAL_ARTWORKS,
    MAX_DEPLOYER_ARTWORKS
  );

  await contractInstance.deployed();
  console.log("Kalos contract address:", contractInstance.address);
  console.log(
    `Kalos is deployed successfully with MAX_TOTAL_ARTWORKS(${MAX_TOTAL_ARTWORKS}), MAX_PERSONAL_ARTWORKS(${MAX_PERSONAL_ARTWORKS}), MAX_DEPLOYER_ARTWORKS(${MAX_DEPLOYER_ARTWORKS})`
  );
  writeContractInfo(contractInstance);
}

function writeContractInfo(contractInstance: any) {
  const data = {
    address: contractInstance.address,
    abi: JSON.parse(contractInstance.interface.format("json")),
  };
  fs.writeFileSync(
    path.resolve("./frontend/src/config/contractInfo.json"),
    JSON.stringify(data)
  );
  console.log("Kalos contract info is written successfully");
}

main().catch((error) => {
  console.error("Deploying Kalos failed", error);
  process.exitCode = 1;
});
