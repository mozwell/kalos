import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import { FormLabel, Button } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import { colord } from "colord";
import { HexAlphaColorPicker } from "react-colorful";
import styled from "@emotion/styled";

import { useOutsideClick } from "../../hooks";

type ColorPickerProps = {
  label: string;
  color: string;
  onColorChange: (color: string) => void;
  FormControlProps?: React.ComponentProps<typeof FormControl>;
};

const PreviewBox = styled.div<{ color: string }>`
  width: 305px;
  height: 40px;
  margin-right: 20px;
  background-color: ${(props) => props.color};
  border-radius: 10px;
  border: 2px solid #cccccc;
`;

const InputContainer = styled.div`
  display: flex;
`;

const PopperContainer = styled.div``;

const ColorPicker = (props: ColorPickerProps) => {
  const { label, color, onColorChange, FormControlProps } = props;

  const [showPopper, setShowPopper] = useState(false);
  const buttonRef = useRef(null);
  const popperRef = useRef(null);
  useOutsideClick(popperRef, () => setShowPopper(false));
  const { styles, attributes } = usePopper(
    buttonRef.current,
    popperRef.current,
    {
      placement: "left",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ],
    },
  );

  const hexValue = colord(color).toHex();

  return (
    <FormControl {...FormControlProps}>
      <FormLabel id={`color-picker-label-${label}`} sx={{ fontSize: "16px" }}>
        {label}
      </FormLabel>
      <InputContainer>
        <PreviewBox color={hexValue}></PreviewBox>
        <Button
          fullWidth
          variant={"soft"}
          ref={buttonRef}
          onClick={() => setShowPopper(true)}
        >
          Change
        </Button>
        <PopperContainer
          ref={popperRef}
          style={{ ...styles.popper, display: showPopper ? "unset" : "none" }}
          {...attributes.popper}
        >
          <HexAlphaColorPicker color={hexValue} onChange={onColorChange} />
        </PopperContainer>
      </InputContainer>
    </FormControl>
  );
};

export { ColorPicker };
