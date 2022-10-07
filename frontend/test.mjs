import { NFTStorage, File } from "nft.storage";
import { config as loadEnv } from "dotenv";
import { Blob } from "buffer";
import mime from "mime";
import fs from "fs";
import path from "path";

loadEnv();

const NFTStorageAPIKey = process.env.NFT_STORAGE_API_KEY;
const array = ['<q id="a"><span id="b">hey!</span></q>'];
const blob = new Blob(array, { type: "text/html" });

async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
}

async function storeNFT() {
  const nftStorage = new NFTStorage({ token: NFTStorageAPIKey });
  const image = await fileFromPath("./raul.jpeg");

  return nftStorage.store({
    image,
    name: "hello guys",
    description: "this is my first NFT",
  });
}

async function main() {
  const result = await storeNFT();
  console.log(result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
