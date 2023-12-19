import { Button, SelectProps } from "antd";
import React, { useCallback, useMemo } from "react";

export function useSelectAll({
  showSelectAll = true,
  options = [],
  value,
  onChange,
}: { showSelectAll?: boolean } & SelectProps) {
  const handleSelectAll = useCallback(() => {
    onChange?.(
      options.map((option) => option.value),
      options
    );
  }, [onChange, options]);

  const handleUnselectAll = useCallback(() => {
    onChange?.([], []);
  }, [onChange]);

  const enchancedOptions = useMemo(() => {
    if (!showSelectAll) return options;

    return [
      {
        label: !value?.length ? (
          <Button type="link" onClick={() => handleSelectAll()}>
            Seleccionar todos
          </Button>
        ) : (
          <Button type="link" onClick={() => handleUnselectAll()}>
            Desseleccionar todos
          </Button>
        ),
        options,
      },
    ];
  }, [
    handleSelectAll,
    handleUnselectAll,
    options,
    showSelectAll,
    value?.length,
  ]);

  return {
    options: enchancedOptions,
    value,
    onChange,
  };
}
