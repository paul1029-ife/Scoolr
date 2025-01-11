"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
type Props = { children?: React.ReactNode };

const ProgressProvider = ({ children }: Props) => {
  return (
    <>
      <ProgressBar
        height="4px"
        color="#00bfff"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  );
};

export default ProgressProvider;
