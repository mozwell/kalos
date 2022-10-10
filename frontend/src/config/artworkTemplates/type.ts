export type ArtworkTemplateType = {
  name: string;
  content: string;
  defaultArgs: {
    color: string[];
    percent: number[];
    px: number[];
    angle: number[];
  };
};

export type ArtworkArgType = keyof ArtworkTemplateType["defaultArgs"];
