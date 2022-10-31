export {};

declare global {
  interface Window {
    setDebugMode?: (val: boolean) => void;
  }
}
