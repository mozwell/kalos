import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, Typography, TextField } from "@mui/joy";
import { Shuffle, Create as CreateIcon } from "@mui/icons-material";

import { Modal } from "../../components/Modal";
import { Frame } from "../../components/Frame";
import { Select } from "../../components/Select";
import { Slider } from "../../components/Slider";

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
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const StyledTextField = styled(TextField)`
  label {
    font-size: 16px;
  }
`;

const mockContent =
  "background-image: radial-gradient(closest-side, transparent 0%, transparent 75%, rgb(182, 204, 102) 76%, rgb(182, 204, 102) 85%, rgb(237, 255, 219) 86%, rgb(237, 255, 219) 94%, rgb(255, 255, 255) 95%, rgb(255, 255, 255) 103%, rgb(217, 230, 167) 104%, rgb(217, 230, 167) 112%, rgb(121, 139, 60) 113%, rgb(121, 139, 60) 121%, rgb(255, 255, 255) 122%, rgb(255, 255, 255) 130%, rgb(224, 234, 215) 131%, rgb(224, 234, 215) 140%), radial-gradient(closest-side, transparent 0%, transparent 75%, rgb(182, 204, 102) 76%, rgb(182, 204, 102) 85%, rgb(237, 255, 219) 86%, rgb(237, 255, 219) 94%, rgb(255, 255, 255) 95%, rgb(255, 255, 255) 103%, rgb(217, 230, 167) 104%, rgb(217, 230, 167) 112%, rgb(121, 139, 60) 113%, rgb(121, 139, 60) 121%, rgb(255, 255, 255) 122%, rgb(255, 255, 255) 130%, rgb(224, 234, 215) 131%, rgb(224, 234, 215) 140%); background-size: 110px 110px; background-color: rgb(200, 211, 167); background-position: 0px 0px, 55px 55px; --darkreader-inline-bgimage:radial-gradient(closest-side, rgba(13, 13, 13, 0) 0%, rgba(13, 13, 13, 0) 75%, #5d652d 76%, #5d652d 85%, #374e0f 86%, #374e0f 94%, #232425 95%, #232425 103%, #464b20 104%, #464b20 112%, #66713a 113%, #66713a 121%, #232425 122%, #232425 130%, #384028 131%, #384028 140%), radial-gradient(closest-side, rgba(13, 13, 13, 0) 0%, rgba(13, 13, 13, 0) 75%, #5d652d 76%, #5d652d 85%, #374e0f 86%, #374e0f 94%, #232425 95%, #232425 103%, #464b20 104%, #464b20 112%, #66713a 113%, #66713a 121%, #232425 122%, #232425 130%, #384028 131%, #384028 140%); --darkreader-inline-bgcolor:#43482b;";

const Create = () => {
  const navigate = useNavigate();
  const closeCreate = () => navigate(-1);

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
          <Select
            label={"Template"}
            defaultValue={"avril"}
            optionList={[
              { name: "Avril Lavigne", value: "avril" },
              { name: "Taylor Swift", value: "taylor" },
            ]}
          />
          <Slider
            FormControlProps={{ sx: { marginTop: "15px" } }}
            label={"Angle 1"}
            min={12}
            max={360}
          ></Slider>
        </LeftContainer>
        <RightContainer>
          <Frame content={mockContent}></Frame>
          <ButtonContainer>
            <Button variant={"solid"} size={"lg"} startDecorator={<Shuffle />}>
              Randomize
            </Button>
            <Button
              variant={"solid"}
              size={"lg"}
              startDecorator={<CreateIcon />}
              sx={{ marginLeft: "25px" }}
            >
              Create
            </Button>
          </ButtonContainer>
        </RightContainer>
      </Wrapper>
    </Modal>
  );
};

export { Create };
