import React, { useState } from "react";
import { Button, Typography } from "@mui/joy";

import { Dialog } from "../../../components/Dialog";
import { useKalos, useKalosEvent } from "../../../hooks";
import { toast } from "../../../utils";

type DestroyDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
};

const DestroyDialog = (props: DestroyDialogProps) => {
  const { artworkId, open, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);

  const contractInstance = useKalos();

  useKalosEvent(
    "Destroy",
    (event) => {
      toast("Transction confirmed. NFT has been destroyed!", {
        type: "success",
      });
    },
    true,
  );

  const handleDestroy = async () => {
    try {
      setIsLoading(true);
      const result = await contractInstance.destroy(artworkId);
      console.log("handleDestroy", "result", result);
      toast("Transaction sent. Waiting for confirmation...");
      onClose();
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
};

export { DestroyDialog };
