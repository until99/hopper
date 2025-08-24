import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Input from "./Input";
import FormField from "./FormField";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  label,
  ...props
}) => {
  return (
    <FormField label={label} className={className}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        icon={MagnifyingGlassIcon}
        placeholder={placeholder}
        {...props}
      />
    </FormField>
  );
};

export default SearchInput;
