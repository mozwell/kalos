import React, { useState } from "react";
import { Button, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { BigNumber } from "ethers";

import { Dialog } from "../../../components/Dialog";
import {
  useKalos,
  useKalosEvent,
  useGlobalStore,
  useTrackTx,
} from "../../../hooks";
import { toast, toastOnTxSent } from "../../../utils";

type DestroyDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
};

const DestroyDialog = observer((props: DestroyDialogProps) => {
  const { artworkId, open, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);

  const contractInstance = useKalos();
  const navigate = useNavigate();
  const { deleteArtwork } = useGlobalStore();

  const { setTrackTxHash } = useTrackTx({
    confirmedToastConfig: {
      text: "Transaction confirmed. Artwork has been destroyed!",
    },
    onSuccess: () => deleteArtwork(artworkId),
  });

  const handleDestroy = async () => {
    try {
      setIsLoading(true);
      const destroyTxInfo = await contractInstance.destroy(artworkId);
      console.log("destroyTxInfo", destroyTxInfo);
      setTrackTxHash(destroyTxInfo.hash);
      onClose();
      navigate("/");
    } catch (e) {
      console.log("handleDestroy", "error", e);
      toast("Transaction failed to sent. Please retry", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

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
});

export { DestroyDialog };
