import React from "react";

import { ColorPicker } from "../../../components/ColorPicker";

const ArtworkColorPicker = (
  props: React.ComponentProps<typeof ColorPicker>,
) => {
  return (
    <ColorPicker FormControlProps={{ sx: { marginTop: "15px" } }} {...props} />
  );
};

export { ArtworkColorPicker };
