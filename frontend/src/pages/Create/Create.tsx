import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, Typography, TextField } from "@mui/joy";
import { Casino, Upload } from "@mui/icons-material";
import { useAccount } from "wagmi";

import { Modal } from "../../components/Modal";
import { Frame } from "../../components/Frame";
import {
  loadTemplates,
  fillInTemplate,
  pickRandomInt,
  pickRandomPercent,
  pickRandomPx,
  pickRandomAngle,
  pickRandomColor,
  uploadNFT,
} from "../../utils";
import { TemplateSelect, ArtworkInputSet } from "./components";
import { toast } from "../../utils";
import { useKalos, useKalosEvent } from "../../hooks";

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

const Create = () => {
  const navigate = useNavigate();
  const closeCreate = () => navigate(-1);

  // Load template set
  const templates = loadTemplates();
  const [currentArgSet, setCurrentArgSet] = useState<any>(
    templates[0].defaultArgs,
  );

  // Init artwork frame
  const [artworkContent, setArtworkContent] = useState(
    fillInTemplate(templates[0].content, templates[0].defaultArgs),
  );

  // When template select changes, render all inputs according to its arg type and number & set default value of every input as provided
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const handleTemplateSelectChange = (newTemplateIndex: number) => {
    setCurrentTemplateIndex(newTemplateIndex);
    setCurrentArgSet(templates[newTemplateIndex].defaultArgs);
  };

  // When input changes, generate new content string and pass it to artwork frame
  const handleArgSetChange = (newArgSet: any) => {
    setCurrentArgSet(newArgSet);
    const newContent = fillInTemplate(
      templates[currentTemplateIndex].content,
      newArgSet,
    );
    setArtworkContent(newContent);
  };

  // When click on Randomize, change template select first, and then change all its input values
  const handleRandomize = () => {
    handleTemplateSelectChange(pickRandomInt(0, templates.length - 1));
    const newArgSet = {
      color: currentArgSet.color.map(pickRandomColor),
      percent: currentArgSet.percent.map(pickRandomPercent),
      px: currentArgSet.color.map(pickRandomPx),
      angle: currentArgSet.color.map(pickRandomAngle),
    };
    handleArgSetChange(newArgSet);
  };

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { address } = useAccount();
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
        author: address || "unknown",
      },
    });
    const mintTxInfo = await contractInstance.mint(artworkUri, address);
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
};

export { Create };
