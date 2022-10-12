const wait = (milliseconds: number, isRejected?: boolean) => {
  return new Promise((resolve, reject) =>
    setTimeout(isRejected ? reject : resolve, milliseconds),
  );
};

export { wait };
