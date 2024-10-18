import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface CheckboxProps {
  checked: boolean;
  type?: "icheck" | "default" | "custom";
  onChange?: (checked: boolean) => void;
  children: any;
}

const Checkbox = ({
  checked = false,
  onChange,
  type = "default",
  children,
}: CheckboxProps) => {
  const [ID] = useState(uuidv4());
  const [value, setValue] = useState(checked);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setValue(isChecked);
    if (onChange) {
      onChange(isChecked);
    }
  };

  // Sync internal state with the `checked` prop
  useEffect(() => {
    if (checked !== value) {
      setValue(checked);
    }
  }, [checked]);

  const getDivClassName = useCallback(() => {
    if (type === "icheck") {
      return "icheck-primary";
    }
    if (type === "custom") {
      return "custom-control custom-checkbox";
    }
    return "form-check";
  }, [type]);

  const getInputClassName = useCallback(() => {
    if (type === "custom") {
      return "custom-control-input";
    }
    return "form-check-input";
  }, [type]);

  const getLabelClassName = useCallback(() => {
    if (type === "custom") {
      return "custom-control-label";
    }
    return "form-check-label";
  }, [type]);

  return (
    <div className={getDivClassName()}>
      <input
        type="checkbox"
        className={getInputClassName()}
        id={ID}
        checked={value}
        onChange={handleOnChange}
      />
      <label htmlFor={ID} className={getLabelClassName()}>
        {children}
      </label>
    </div>
  );
};

export default Checkbox;
