import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/joy";
import { Casino, Upload } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

import { CreateStore } from "./store";
import { Modal } from "../../components";
import { TemplateSelect, ArtworkInputSet } from "./components";
import { useKalos, useStore, useGlobalStore, useTrackTx } from "../../hooks";
import {
  Wrapper,
  LeftContainer,
  RightContainer,
  ButtonContainer,
  StyledTextField,
  StyledFrame,
} from "./styled";

const MAX_TITLE_LENGTH = 44;
const MAX_DESC_LENGTH = 300;

const Create = observer(() => {
  const navigate = useNavigate();
  const { myAddress, addArtwork, debugModeEnabled } = useGlobalStore();
  const contractInstance = useKalos();
  const { setTrackTxHash } = useTrackTx({
    skipTxConfirmedToast: true,
    onSuccess: (data) => {
      handleTxSuccess(data);
    },
  });

  const frameRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

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
    titleError,
    descError,
    debugContent,
    handleDebugContentChange,
  } = useStore(CreateStore, {
    myAddress,
    contractInstance,
    setTrackTxHash,
    addArtwork,
    navigate,
    frameRef,
    dialogRef,
    debugModeEnabled,
  });

  return (
    <Modal ref={dialogRef} size={"xlarge"} open handleClose={closeCreate}>
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
            helperText={titleError}
            error={Boolean(titleError)}
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
            helperText={descError}
            error={Boolean(descError)}
          />
          {debugModeEnabled && (
            <StyledTextField
              label="Content"
              placeholder="Set your artwork content here (only for debug mode)"
              variant="outlined"
              required
              size="lg"
              sx={{ marginTop: "10px", marginBottom: "10px" }}
              value={debugContent}
              onChange={handleDebugContentChange}
            />
          )}
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
          <StyledFrame
            ref={frameRef}
            content={debugModeEnabled ? debugContent : artworkContent}
          />
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
              disabled={saving}
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
