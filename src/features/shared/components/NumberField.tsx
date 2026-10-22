/**
 * Purpose:
 * Whole-number field (canvas sizes and other measures): label, mono numeric input, hint and inline
 * range error, built on FormField and Input.
 *
 * Notes:
 * A text input with `inputMode="numeric"` (no spinner, no native range bubble); Enter submits the
 * parent form like any text field. Pass `data-autofocus` to focus it when a Modal opens.
 */
"use client";

import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";
import { numberField } from "./NumberField.style";
import type { TNumberFieldProps } from "./NumberField.type";
import { useNumberField } from "./useNumberField";

export function NumberField({
  label,
  min,
  max,
  error,
  hint,
  className,
  value,
  onBlur,
  ...rest
}: TNumberFieldProps) {
  const { id, errorId, shownError, maxLength, ariaInvalid, describedBy, handleBlur } =
    useNumberField({ value, min, max, error, onBlur });

  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={hint}
      error={shownError}
      errorId={errorId}
      className={className}
    >
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        enterKeyHint="done"
        maxLength={maxLength}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        className={numberField.input}
        value={value}
        onBlur={handleBlur}
        {...rest}
      />
    </FormField>
  );
}
