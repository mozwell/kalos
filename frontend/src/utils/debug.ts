const wait = (milliseconds: number, isRejected?: boolean) => {
  return new Promise((resolve, reject) =>
    setTimeout(isRejected ? reject : resolve, milliseconds),
  );
};

const isLocalEnv = () => {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  return process.env.NODE_ENV === "development";
};

export { wait, isLocalEnv };
