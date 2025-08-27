import { type ReactNode } from "react";

interface InputRootProps {
  children: ReactNode;
  className?: string;
}

export const InputRoot = ({ children }: InputRootProps) => {
  return <div className="relative">{children}</div>;
};
