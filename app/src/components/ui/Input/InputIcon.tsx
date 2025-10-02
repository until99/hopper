interface InputIconProps {
  icon: React.ReactNode
}

export const InputIcon = ({ icon }: InputIconProps) => {
  return (
    <span className="text-slate-400 pl-3">
      {icon}
    </span>
  );
};
