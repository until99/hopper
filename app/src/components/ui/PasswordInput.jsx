import { useState } from "react";
import { EyeIcon, EyeSlashIcon, LockIcon } from "@phosphor-icons/react";
import Input from "./Input";

const PasswordInput = ({ showToggle = true, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const RightIcon = showToggle
    ? () => (
        <button
          type="button"
          onClick={toggleVisibility}
          className="text-slate-400 transition-colors hover:text-slate-600"
        >
          {showPassword ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      )
    : undefined;

  return (
    <Input
      type={showPassword ? "text" : "password"}
      icon={LockIcon}
      rightIcon={RightIcon}
      {...props}
    />
  );
};

export default PasswordInput;
