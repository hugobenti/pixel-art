/**
 * Purpose:
 * On/off setting as a full-width row: optional icon, label and hint on the left, a switch track on
 * the right. `role="switch"` with `aria-checked`, so the row states the current value.
 *
 * Notes:
 * Disabled dims only the track; the label and hint keep full contrast so the hint can explain why.
 */
"use client";

import { cx } from "@/features/shared/utils/cx";
import { switchRow } from "./Switch.style";
import type { ISwitchProps } from "./Switch.type";
import { useSwitch } from "./useSwitch";

export function Switch(props: ISwitchProps) {
  const { checked, label, hint, icon, disabled, className } = props;
  const { labelId, hintId, toggle } = useSwitch(props);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={hint ? hintId : undefined}
      disabled={disabled}
      onClick={toggle}
      className={cx(switchRow.base, className)}
    >
      <span className={switchRow.lead}>
        {icon}
        <span className={switchRow.text}>
          <span id={labelId}>{label}</span>
          {hint ? (
            <span id={hintId} className={switchRow.hint}>
              {hint}
            </span>
          ) : null}
        </span>
      </span>
      <span aria-hidden className={switchRow.track}>
        <span className={switchRow.thumb} />
      </span>
    </button>
  );
}
