import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const MAX_TOTAL_ARTWORKS = 999;
  const MAX_PERSONAL_ARTWORKS = 3;
  const MAX_DEPLOYER_ARTWORKS = 10;

  const Contract = await ethers.getContractFactory("Kalos");
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
    path.resolve("./frontend/src/contractInfo.json"),
    JSON.stringify(data)
  );
}

main().catch((error) => {
  console.error("Deploying Kalos failed", error);
  process.exitCode = 1;
});
