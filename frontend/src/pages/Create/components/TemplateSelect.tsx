import React from "react";

import { Select } from "../../../components/Select";
import { ArtworkTemplateType } from "../../../config/artworkTemplates";

const TemplateSelect = (props: { templates: ArtworkTemplateType[] }) => {
  const { templates } = props;
  const defaultValue = templates[0].name;
  const optionList = templates.map((template) => ({
    name: template.name,
    value: template.name,
  }));

  return (
    <Select
      label={"Template"}
      defaultValue={defaultValue}
      optionList={optionList}
    />
  );
};

export { TemplateSelect };
