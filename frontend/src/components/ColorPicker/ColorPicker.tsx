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
  position: relative;
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
            offset: [0, 20],
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
          onClick={() => setShowPopper(!showPopper)}
        >
          Change
        </Button>
        {showPopper ? (
          <PopperContainer
            ref={popperRef}
            // A hack to fix popper wrong position bug
            style={{
              ...styles.popper,
              zIndex: 999,
              transform: "unset",
              left: "-10px",
              width: "fit-content",
            }}
            {...attributes.popper}
          >
            <HexAlphaColorPicker color={hexValue} onChange={onColorChange} />
          </PopperContainer>
        ) : null}
      </InputContainer>
    </FormControl>
  );
};

export { ColorPicker };
