/** A pixel grid: one character per pixel, "." is transparent; every other character is a color key. */
export type TBrandGrid = readonly string[];

/** Pencil colors, the same in both themes. */
export type TBrandFixedKey = "y" | "Y" | "o" | "w" | "W" | "G" | "q" | "s" | "m" | "M" | "e" | "f" | "E";

/** Colors that follow the theme: the drawn pixel (`d`), "Pixel" (`i`) and "HB" (`h`) in the wordmark. */
export type TBrandThemeKey = "d" | "i" | "h";

export type TBrandGridName = "pencil" | "wordmark" | "brandPencil" | "pencilEnd";
