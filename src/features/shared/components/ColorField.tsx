/**
 * Purpose:
 * Color field: a swatch that opens the native picker plus a mono hex input (`#RRGGBB`, paste-friendly),
 * synced both ways, with an inline error for invalid hex. Built on FormField and Input.
 */
"use client";

import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";
import { colorField } from "./ColorField.style";
import type { IColorFieldProps } from "./ColorField.type";
import { useColorField } from "./useColorField";

export function ColorField({
  label,
  hideLabel = false,
  value,
  onValueChange,
  disabled,
  hint,
  className,
}: IColorFieldProps) {
  const {
    hexId,
    errorId,
    draft,
    error,
    pickerLabel,
    ariaInvalid,
    describedBy,
    changePicker,
    changeHex,
    blurHex,
    keyDownHex,
  } = useColorField({ label, value, onValueChange });

  return (
    <FormField
      label={label}
      hideLabel={hideLabel}
      htmlFor={hexId}
      hint={hint}
      error={error}
      errorId={errorId}
      className={className}
    >
      <div className={colorField.row}>
        <input
          type="color"
          value={value}
          disabled={disabled}
          aria-label={pickerLabel}
          className={colorField.swatch}
          onChange={changePicker}
        />
        <div className={colorField.hexWrap}>
          <Input
            id={hexId}
            name="hex"
            value={draft}
            disabled={disabled}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={9}
            aria-invalid={ariaInvalid}
            aria-describedby={describedBy}
            className={colorField.hex}
            onChange={changeHex}
            onBlur={blurHex}
            onKeyDown={keyDownHex}
          />
        </div>
      </div>
    </FormField>
  );
}
