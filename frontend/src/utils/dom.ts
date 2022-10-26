const SHAKE_KEYFRAMES = [
  { transform: "translateX(0%)" },
  { transform: "translateX(-16%)" },
  { transform: "translateX(16%)" },
  { transform: "translateX(-8%)" },
  { transform: "translateX(8%)" },
  { transform: "translateX(0%)" },
];

const SHAKE_DEFAULT_OPTIONS = {
  duration: 550,
  iterations: 1,
};

const playAnimation = (
  target: React.MutableRefObject<HTMLElement | null>,
  keyframes: Parameters<Animatable["animate"]>[0],
  options: Parameters<Animatable["animate"]>[1],
) => {
  if (target.current === null) {
    return;
  }
  target.current.animate(keyframes, options);
};

const shake = (
  target: React.MutableRefObject<HTMLElement | null>,
  userOptions?: Parameters<Animatable["animate"]>[1],
) => {
  const options = userOptions ?? SHAKE_DEFAULT_OPTIONS;
  playAnimation(target, SHAKE_KEYFRAMES, options);
};

export { playAnimation, shake };
