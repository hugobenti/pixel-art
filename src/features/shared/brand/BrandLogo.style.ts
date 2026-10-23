/**
 * Purpose:
 * Classes for BrandLogo, whole-number scales only (docs/design/brand.md): the 74 × 7 horizontal lockup
 * at 2× on phones and 3× from `sm` up, the 50 × 7 banner at 6× and 8×, the 33 × 7 pencil at 2×.
 */

export const brandLogo = {
  svg: "block h-auto shrink-0",
  variant: {
    horizontal: "w-[148px] sm:w-[222px]",
    banner: "w-[300px] md:w-[400px]",
    pencil: "w-[66px]",
  },
};
