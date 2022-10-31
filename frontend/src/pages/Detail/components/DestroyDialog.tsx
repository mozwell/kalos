import React, { useState, useCallback } from "react";
import { Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import { Dialog } from "../../../components";
import { useKalos, useGlobalStore, useTrackTx } from "../../../hooks";
import { toastOnEthersError } from "../../../utils";

type DestroyDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
};

const DestroyDialog = (props: DestroyDialogProps) => {
  const { artworkId, open, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);

  const contractInstance = useKalos();
  const navigate = useNavigate();
  const { deleteArtwork } = useGlobalStore();
  const { setTrackTxHash } = useTrackTx({
    confirmedToastConfig: {
      text: "Transaction confirmed. Artwork has been destroyed!",
    },
    onSuccess: () => {
      deleteArtwork(artworkId);
      navigate("/");
    },
  });

  const handleDestroy = useCallback(async () => {
    try {
      setIsLoading(true);
      const destroyTxInfo = await contractInstance.destroy(artworkId);
      console.log("destroyTxInfo", destroyTxInfo);
      setTrackTxHash(destroyTxInfo.hash);
      onClose();
    } catch (error) {
      console.log("handleDestroy", "error", error);
      toastOnEthersError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, contractInstance, artworkId, setTrackTxHash, onClose]);

  return (
    <Dialog
      size={"small"}
      title={"Destroy your artwork"}
      open={open}
      onClose={onClose}
      onConfirm={handleDestroy}
      confirmText="Destroy"
      confirmType={"danger"}
      loading={isLoading}
    >
      <Typography level={"h6"}>
        Your artwork will be permanently deleted from blockchain. Do you still
        want to destroy it?
      </Typography>
    </Dialog>
  );
};

export { DestroyDialog };
