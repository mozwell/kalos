import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, TextField } from "@mui/joy";
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
  width: 50%;
  box-sizing: border-box;
  padding-top: 30px;
`;

const RightContainer = styled.div`
  width: 50%;
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
  const closeCreate = () => navigate(-1);

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
  const contractInstance = useKalos();

  useKalosEvent(
    "Mint",
    (event) => {
      toast("Transction confirmed. NFT has been created!", { type: "success" });
    },
    true,
  );

  const handleSaveMint = async () => {
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
              startDecorator={<Upload />}
              sx={{ marginLeft: "25px" }}
              onClick={handleSaveMint}
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
