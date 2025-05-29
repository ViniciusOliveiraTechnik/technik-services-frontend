import React, { forwardRef } from "react";
import { PatternFormat } from "react-number-format";
import { Input } from "@/components/ui/input";

const ContactInput = forwardRef(({ onChange, ...props }, ref) => {
  return (
    <PatternFormat
      format="(##) #####-####"
      allowEmptyFormatting
      mask="_"
      customInput={Input}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange(values.value);
      }}
      {...props}
    />
  );
});

ContactInput.displayName = "ContactInput";

export default ContactInput;
