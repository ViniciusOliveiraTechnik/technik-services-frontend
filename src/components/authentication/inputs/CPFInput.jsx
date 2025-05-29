import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { PatternFormat } from "react-number-format";

const CPFInput = forwardRef(({ onChange, ...props }, ref) => {
  return (
    <PatternFormat
      format="###.###.###-##"
      mask="_"
      getInputRef={ref}
      allowEmptyFormatting
      customInput={Input}
      valueIsNumericString
      onValueChange={(values) => {
        onChange(values.value);
      }}
      {...props}
    />
  );
});

CPFInput.displayName = "CPFInput";

export default CPFInput;
