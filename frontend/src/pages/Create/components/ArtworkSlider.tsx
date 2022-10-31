import React from "react";

import { ARTWORK_ARG_RANGE } from "../../../config/artworkTemplates";
import { Slider } from "../../../components";

type ArtworkSliderProps = {
  type: "percent" | "px" | "angle";
  label: string;
  value: number;
  onChange: (event: Event, value: number | number[]) => void;
};

const ArtworkSlider = (props: ArtworkSliderProps) => {
  const { type, label, value, onChange } = props;
  const [min, max] = ARTWORK_ARG_RANGE[type];

  return (
    <Slider
      FormControlProps={{ sx: { marginTop: "15px" } }}
      label={label}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
    ></Slider>
  );
};

export { ArtworkSlider };
