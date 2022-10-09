import React from "react";
import { FormLabel, FormHelperText, Select as _Select, Option } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";

type SelectProps = {
  label: string;
  defaultValue: string;
  optionList: { name: string; value: string }[];
  helperText?: string;
} & React.ComponentProps<typeof _Select>;

const Select = (props: SelectProps) => {
  const { label, defaultValue, optionList, helperText, ...restProps } = props;
  return (
    <FormControl>
      <FormLabel
        id="select-field-demo-label"
        htmlFor="select-field-demo-button"
        sx={{ fontSize: "16px" }}
      >
        {label}
      </FormLabel>
      <_Select
        size={"lg"}
        defaultValue={defaultValue}
        componentsProps={{
          button: {
            id: "select-field-demo-button",
            "aria-labelledby":
              "select-field-demo-label select-field-demo-button",
          },
        }}
        {...restProps}
      >
        {optionList.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.name}
          </Option>
        ))}
      </_Select>
      {helperText && (
        <FormHelperText id="select-field-demo-helper">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export { Select };
