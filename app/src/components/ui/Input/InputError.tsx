interface InputErrorProps {
  errorMessage?: string;
}

export const InputError = ({ errorMessage }: InputErrorProps) => {
  return <p className="text-red-500 text-sm mt-1">{errorMessage}</p>;
};
