import { useColorScheme } from "@mui/joy/styles";

const useDarkMode = () => {
  const { setMode } = useColorScheme();
  setMode("dark");
};

export { useDarkMode };
