import React, { useEffect } from "react";

const useOutsideClick = (
  ref: React.MutableRefObject<any>,
  onClickOutside: (event: MouseEvent) => void,
) => {
  useEffect(() => {
    // Call onClickOutside if user clicks outside the referred component
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside(event);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export { useOutsideClick };
