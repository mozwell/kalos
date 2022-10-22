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
import { uploadNFT, toastOnEthersError, toast } from "../../utils";
import { TemplateSelect, ArtworkInputSet } from "./components";
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

  const { myAddress, addArtwork } = useGlobalStore();

  const contractInstance = useKalos();

  const { setTrackTxHash } = useTrackTx({
    skipTxConfirmedToast: true,
    onSuccess: (data) => {
      handleTxSuccess(data);
    },
  });

  const {
    saving,
    title,
    desc,
    handleTitleChange,
    handleDescChange,
    artworkContent,
    currentArgSet,
    setCurrentArg,
    templates,
    currentTemplateIndex,
    handleTemplateSelectChange,
    handleRandomize,
    handleSaveMint,
    handleTxSuccess,
    closeCreate,
  } = useStore(CreateStore, {
    myAddress,
    contractInstance,
    setTrackTxHash,
    addArtwork,
    navigate,
  });

  const saveDisabled = !(title && desc);

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
            onChange={handleTitleChange}
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
            onChange={handleDescChange}
            maxlength={MAX_DESC_LENGTH}
          />
          <TemplateSelect
            templates={templates}
            currentTemplateIndex={currentTemplateIndex}
            onChange={handleTemplateSelectChange}
          />
          <ArtworkInputSet
            currentArgSet={currentArgSet}
            onCurrentArgChange={setCurrentArg}
          />
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
