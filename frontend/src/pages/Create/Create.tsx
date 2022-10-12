import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, TextField, CircularProgress } from "@mui/joy";
import { Casino, Upload } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

import { CreateStore } from "./store";
import { Modal } from "../../components/Modal";
import { Frame } from "../../components/Frame";
import { uploadNFT } from "../../utils";
import { TemplateSelect, ArtworkInputSet } from "./components";
import { toast } from "../../utils";
import { useKalos, useKalosEvent, useStore, useGlobalStore } from "../../hooks";

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

const Create = observer(() => {
  const navigate = useNavigate();
  const closeCreate = () => navigate("/");

  const { myAddress } = useGlobalStore();
  const {
    artworkContent,
    currentArgSet,
    templates,
    currentTemplateIndex,
    handleTemplateSelectChange,
    handleArgSetChange,
    handleRandomize,
  } = useStore(CreateStore);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const contractInstance = useKalos();

  useKalosEvent(
    "Mint",
    (event) => {
      toast("Transction confirmed. NFT has been created!", { type: "success" });
    },
    true,
  );

  const handleSaveMint = async () => {
    try {
      setSaving(true);
      const { artworkUri } = await uploadNFT({
        name: title,
        description: desc,
        properties: {
          content: artworkContent,
          createdTime: Date.now(),
          author: myAddress || "unknown",
        },
      });
      const mintTxInfo = await contractInstance.mint(artworkUri, myAddress);
      console.log("mintTxInfo", mintTxInfo);
      toast("Transction sent. Waiting for confirmation...");
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
