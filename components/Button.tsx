import React from "react";
import { ImSpinner2 } from "react-icons/im";

type Props = {
  variant?: "primary" | "default";
  isLoading?: boolean;
  children: any;
  className?: string;
  [rest: string]: any;
};

export default function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      className={`${variant}-button flex items-center justify-center gap-1 ${className}`}
      {...rest}
    >
      {isLoading && <ImSpinner2 className="animate-spin" />}

      {children}
    </button>
  );
}
