import { InputError } from "./InputError";
import { InputIcon } from "./InputIcon";

interface InputFieldProps {
  id: string;
  type: "text" | "email" | "password";
  placeholder: string;
  value?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  minLength?: number;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField = ({
  id,
  placeholder,
  type,
  value,
  error,
  errorMessage,
  disabled,
  minLength,
  icon,
  required,
  onChange,
}: InputFieldProps) => {
  return (
    <>
      <div className="border rounded-lg border-slate-300 flex items-center">
        {icon && <InputIcon icon={icon} />}
        <input
          id={id}
          type={type}
          className={`border-none outline-none w-full border border-slate-300 rounded-lg p-2 text-sm ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={value}
          minLength={minLength}
          disabled={disabled}
          onChange={onChange}
          required={required}
        />
      </div>
      {error && <InputError errorMessage={errorMessage} />}
    </>
  );
};
