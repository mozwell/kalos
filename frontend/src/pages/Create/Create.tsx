import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/joy";
import { Casino, Upload } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

import { CreateStore } from "./store";
import { Modal } from "../../components/Modal";
import { Frame } from "../../components/Frame";
import { TextField } from "../../components/TextField";
import { uploadNFT, toastOnEthersError } from "../../utils";
import { TemplateSelect, ArtworkInputSet } from "./components";
import { toast, toastOnTxSent } from "../../utils";
import {
  useKalos,
  useKalosEvent,
  useStore,
  useGlobalStore,
  useTrackTx,
} from "../../hooks";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const LeftContainer = styled.div`
  width: 53%;
  padding-right: 2.5%;
  padding-left: 1%;
  box-sizing: border-box;
  padding-top: 30px;
  max-height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(100, 100, 100, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

const RightContainer = styled.div`
  width: 47%;
  height: 80%;
  box-sizing: border-box;
  padding: 30px;
`;

const ButtonContainer = styled.div`
  margin-top: 70px;
  display: flex;
  justify-content: center;
`;

const StyledTextField = styled(TextField)`
  label {
    font-size: 16px;
  }
`;

const StyledFrame = styled(Frame)`
  margin-top: 25px;
`;

const MAX_TITLE_LENGTH = 44;
const MAX_DESC_LENGTH = 300;

const Create = observer(() => {
  const navigate = useNavigate();
  const closeCreate = () => navigate("/");

  const { myAddress, addArtwork } = useGlobalStore();
  const {
    artworkContent,
    currentArgSet,
    templates,
    currentTemplateIndex,
    handleTemplateSelectChange,
    handleArgSetChange,
    handleRandomize,
    stampCreatedTime,
    createdTime,
  } = useStore(CreateStore);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const contractInstance = useKalos();
  const saveDisabled = !(title && desc);

  const { setTrackTxHash } = useTrackTx({
    skipTxConfirmedToast: true,
    onSuccess: (data) => {
      console.log("create", "useTrackTx", "onSuccess", "data", data);
      const artworkId = data.logs[0].topics[3];
      // We need to store a snapshot to provide user with what they have created since IPFS gateway is unstable.
      addArtwork(artworkId, {
        artworkId,
        title,
        desc,
        createdTime,
        author: myAddress || "unknown",
        content: artworkContent,
        owner: myAddress || "unknown",
        tipBalance: 0,
      });
      toast("Transaction confirmed. Artwork has been created!", {
        type: "success",
        actionText: "Preview",
        onAction: () => navigate(`/detail/${artworkId}`),
      });
    },
  });

  const handleSaveMint = async () => {
    try {
      setSaving(true);
      const timestamp = stampCreatedTime();
      const uploadOptions = {
        name: title,
        description: desc,
        properties: {
          content: artworkContent,
          createdTime: timestamp,
          author: myAddress || "unknown",
        },
      };
      console.log("handleSaveMint", "uploadOptions", uploadOptions);
      const { artworkUri } = await uploadNFT(uploadOptions);
      const mintTxInfo = await contractInstance.mint(artworkUri, myAddress);
      console.log("mintTxInfo", mintTxInfo);
      setTrackTxHash(mintTxInfo.hash);
    } catch (error) {
      console.log("handleSaveMint", "error", error);
      toastOnEthersError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal size={"xlarge"} open handleClose={closeCreate}>
      <Wrapper>
        <LeftContainer>
          <StyledTextField
            label="Title"
            placeholder="Title of the artwork"
            variant="outlined"
            required
            size="lg"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            maxlength={MAX_TITLE_LENGTH}
          />
          <StyledTextField
            label="Description"
            placeholder="Describe your artwork"
            variant="outlined"
            required
            size="lg"
            sx={{ marginTop: "10px", marginBottom: "10px" }}
            value={desc}
            onChange={(e) => setDesc(e.currentTarget.value)}
            maxlength={MAX_DESC_LENGTH}
          />
          <TemplateSelect
            templates={templates}
            currentTemplateIndex={currentTemplateIndex}
            onChange={handleTemplateSelectChange}
          />
          <ArtworkInputSet
            argSet={currentArgSet}
            onArgSetChange={handleArgSetChange}
          ></ArtworkInputSet>
        </LeftContainer>
        <RightContainer>
          <StyledFrame content={artworkContent} />
          <ButtonContainer>
            <Button
              variant={"solid"}
              size={"lg"}
              startDecorator={<Casino />}
              onClick={handleRandomize}
            >
              Randomize
            </Button>
            <Button
              variant={"solid"}
              size={"lg"}
              sx={{ marginLeft: "25px" }}
              onClick={handleSaveMint}
              disabled={saveDisabled || saving}
              startDecorator={
                saving ? (
                  <CircularProgress variant="plain" thickness={2} />
                ) : (
                  <Upload />
                )
              }
            >
              Save & Mint
            </Button>
          </ButtonContainer>
        </RightContainer>
      </Wrapper>
    </Modal>
  );
});

export { Create };
