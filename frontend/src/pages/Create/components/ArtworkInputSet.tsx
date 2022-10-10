import React from "react";

import { ArtworkColorPicker } from "./ArtworkColorPicker";
import { ArtworkSlider } from "./ArtworkSlider";
import {
  ArtworkTemplateType,
  ArtworkArgType,
} from "../../../config/artworkTemplates";

type ArtworkInputSetProps = {
  argSet: ArtworkTemplateType["defaultArgs"];
  onArgSetChange: (argSet: ArtworkTemplateType["defaultArgs"]) => void;
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const genInputLabel = (type: ArtworkArgType, index: number) => {
  return `${capitalize(type)} ${index + 1}`;
};

const ArtworkInputSet = (props: ArtworkInputSetProps) => {
  const { argSet, onArgSetChange } = props;

  const onChangeGen = (type: ArtworkArgType, index: number) => {
    const commonGenLogic = (value: string | number) => {
      const newArgSet = { ...argSet };
      newArgSet[type][index] = value;
      onArgSetChange(newArgSet);
    };
    if (type === "color") {
      return (value: string) => commonGenLogic(value);
    }
    return (event: Event, value: number) => commonGenLogic(value);
  };

  const renderColorPickers = (colorArgList: string[]) => {
    return (
      <>
        {colorArgList.map((color, index) => {
          return (
            <ArtworkColorPicker
              key={index}
              label={genInputLabel("color", index)}
              color={color}
              onColorChange={onChangeGen("color", index) as any}
            />
          );
        })}
      </>
    );
  };

  const renderSliders = (
    type: "percent" | "px" | "angle",
    argList: number[],
  ) => {
    return (
      <>
        {argList.map((arg, index) => {
          return (
            <ArtworkSlider
              type={type}
              key={index}
              label={genInputLabel(type, index)}
              value={arg}
              onChange={onChangeGen(type, index) as any}
            ></ArtworkSlider>
          );
        })}
      </>
    );
  };

  return (
    <>
      {renderColorPickers(argSet.color)}
      {renderSliders("percent", argSet.percent)}
      {renderSliders("px", argSet.px)}
      {renderSliders("angle", argSet.angle)}
    </>
  );
};

export { ArtworkInputSet };
