import React from "react";
import { TextField as _TextField } from "@mui/joy";

type TextFieldProps = {
  maxlength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.ComponentProps<typeof _TextField>;

const TextField = (props: TextFieldProps) => {
  const { maxlength, onChange, ...restProps } = props;
  const onChangeWithinMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxlength === undefined || e.currentTarget.value.length <= maxlength) {
      onChange?.(e);
    }
  };
  return <_TextField onChange={onChangeWithinMax} {...restProps}></_TextField>;
};

export { TextField };
