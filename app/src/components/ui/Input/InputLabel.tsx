interface InputLabelProps {
  htmlFor: string;
  innerText: string;
  required?: boolean;
}

export const InputLabel = ({
  htmlFor,
  innerText,
  required,
}: InputLabelProps) => {
  return (
    <div className="flex pb-2 text-sm font-semibold gap-1">
      <label htmlFor={htmlFor}>{innerText}</label>
      {required && <p className="text-red-500">*</p>}
    </div>
  );
};
