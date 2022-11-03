import * as Wagmi from "wagmi";

import { useKalos, BASIC_CONFIG } from "../kalos";

jest.mock("nft.storage", () => ({
  NFTStorage: jest.fn(),
}));

describe("kalos", () => {
  describe("useKalos", () => {
    it("should return kalosInstance after passing correct parameters", () => {
      jest.spyOn(Wagmi, "useSigner").mockReturnValue({ data: "signerData" });
      jest.spyOn(Wagmi, "useContract").mockReturnValue("kalosInstance");
      const result = useKalos();
      expect(Wagmi.useSigner).toHaveBeenCalled();
      expect(Wagmi.useContract).toHaveBeenCalledWith({
        ...BASIC_CONFIG,
        signerOrProvider: "signerData",
      });
      expect(result).toBe("kalosInstance");
    });
  });
});
