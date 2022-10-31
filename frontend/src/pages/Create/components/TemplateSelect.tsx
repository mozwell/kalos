import React, { useMemo, useCallback } from "react";

import { Select } from "../../../components";
import { ArtworkTemplateType } from "../../../config/artworkTemplates";

type TemplateSelectProps = {
  templates: ArtworkTemplateType[];
  currentTemplateIndex: number;
  onChange: (value: number) => void;
};

const TemplateSelect = (props: TemplateSelectProps) => {
  const { templates, currentTemplateIndex, onChange } = props;
  const optionList = useMemo(
    () =>
      templates.map((template, index) => ({
        name: template.name,
        value: String(index),
      })),
    [templates],
  );

  const handleChange = useCallback(
    (e: React.MouseEvent | null, currentTemplateIndex: string) => {
      onChange(Number(currentTemplateIndex));
    },
    [onChange],
  );

  return (
    <Select
      label={"Template"}
      defaultValue={templates[0].name}
      optionList={optionList}
      value={String(currentTemplateIndex)}
      onChange={handleChange as any}
    />
  );
};

export { TemplateSelect };
