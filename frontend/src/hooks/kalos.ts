import { Interface } from "ethers/lib/utils";
import { ethers } from "ethers";
import {
  useContractRead,
  useContract,
  useSigner,
  useContractEvent,
  useWaitForTransaction,
} from "wagmi";

import contractInfo from "../config/contractInfo.json";

const BASIC_CONFIG = {
  addressOrName: contractInfo.address,
  contractInterface: new Interface(contractInfo.abi),
};

const DEFAULT_MINIMAL_CONFIRMATION = 1;

const useKalos = () => {
  const { data: signerData } = useSigner();
  const kalosInstance = useContract({
    ...BASIC_CONFIG,
    signerOrProvider: signerData,
  });
  return kalosInstance;
};

const useKalosEvent = (
  eventName: string,
  listener: ethers.providers.Listener,
) => {
  useContractEvent({
    ...BASIC_CONFIG,
    eventName,
    listener,
  });
};

const useWaitKalosTx = (txHash: string) => {
  const txInfo = useWaitForTransaction({
    confirmations: DEFAULT_MINIMAL_CONFIRMATION,
    hash: txHash,
  });
  return txInfo;
};

// To watch change in getter's return value and update automatically
const useKalosWatch = (getterName: string) => {
  const result = useContractRead({
    ...BASIC_CONFIG,
    functionName: getterName,
    watch: true,
  });
  return result;
};

export { useKalos, useKalosEvent, useWaitKalosTx, useKalosWatch };
