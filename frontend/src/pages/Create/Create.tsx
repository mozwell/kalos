import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, Typography, TextField } from "@mui/joy";
import { Casino, Upload } from "@mui/icons-material";

import { Modal } from "../../components/Modal";
import { Frame } from "../../components/Frame";
import { loadTemplates, fillInTemplate } from "../../utils";
import { TemplateSelect, ArtworkInputSet } from "./components";

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
  const [color, setColor] = useState("rgb(55, 155, 255)");

  // Load template set
  const templates = loadTemplates();
  const [currentArgSet, setCurrentArgSet] = useState<any>(
    templates[0].defaultArgs,
  );

  const [artworkContent, setArtworkContent] = useState(
    fillInTemplate(templates[0].content, templates[0].defaultArgs),
  );

  // When template select changes, render all inputs according to its arg type and number & set default value of every input as provided

  // When input changes, generate new content string and pass it to artwork frame
  const handleArgSetChange = (value: any) => {
    setCurrentArgSet(value);
    const currentContent = fillInTemplate(templates[0].content, currentArgSet);
    setArtworkContent(currentContent);
  };

  // When click on Randomize, change template select first, and then change all its input values

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
          />
          <StyledTextField
            label="Description"
            placeholder="Describe your artwork"
            variant="outlined"
            required
            size="lg"
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          />
          <TemplateSelect templates={templates} />
          <ArtworkInputSet
            argSet={currentArgSet}
            onArgSetChange={handleArgSetChange}
          ></ArtworkInputSet>
        </LeftContainer>
        <RightContainer>
          <StyledFrame content={artworkContent} />
          <ButtonContainer>
            <Button variant={"solid"} size={"lg"} startDecorator={<Casino />}>
              Randomize
            </Button>
            <Button
              variant={"solid"}
              size={"lg"}
              startDecorator={<Upload />}
              sx={{ marginLeft: "25px" }}
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
