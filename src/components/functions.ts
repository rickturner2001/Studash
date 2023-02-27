import type { Dispatch, RefObject, SetStateAction } from "react";

export const validateRef = (
  ref: RefObject<HTMLInputElement>,
  isNumeric: boolean,
  setIsError: Dispatch<SetStateAction<boolean>>
) => {
  const refValue = ref?.current?.value;

  if (refValue) {
    if (!isNumeric) {
      setIsError(false);
      return { isValid: true, value: refValue };
    } else {
      if (!isNaN(+refValue)) {
        setIsError(false);
        return { isValid: true, value: +refValue };
      } else {
        setIsError(true);
        return { isValid: false, value: "" };
      }
    }
  } else {
    setIsError(true);
    return { isValid: false, value: "" };
  }
};
