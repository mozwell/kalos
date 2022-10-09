import React from "react";
import { FormLabel, Slider as _Slider } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";

type SliderProps = {
  label: string;
  FormControlProps?: React.ComponentProps<typeof FormControl>;
} & React.ComponentProps<typeof _Slider>;

const Slider = (props: SliderProps) => {
  const { label, FormControlProps, ...restProps } = props;
  return (
    <FormControl {...FormControlProps}>
      <FormLabel id="slider-field-demo-label" sx={{ fontSize: "16px" }}>
        {label}
      </FormLabel>
      <_Slider size={"lg"} valueLabelDisplay={"auto"} {...restProps}></_Slider>
    </FormControl>
  );
};

export { Slider };
