/** Page metadata for the whole app. */
export interface ISiteContent {
  name: string;
  description: string;
}

/** An icon control: its accessible name and its tooltip. */
export interface ILabeledControl {
  label: string;
  title: string;
}

/** An icon button: its accessible name and, when it has one, its keyboard shortcut for the tooltip. */
export interface IIconControl {
  label: string;
  shortcut?: string;
}

export interface ISharedContent {
  loading: string;
  actions: {
    save: string;
    cancel: string;
    apply: string;
    close: string;
    add: string;
    remove: string;
    rename: string;
  };
  fields: {
    width: string;
    height: string;
  };
  toast: {
    dismissLabel: string;
    dismissGlyph: string;
  };
  sideDrawer: {
    /** Backdrop button name when the caller doesn't pass its own. */
    closeLabel: string;
  };
  iconButton: {
    /** Tooltip of an icon button that has a keyboard shortcut. */
    titleWithShortcut: (label: string, shortcut: string) => string;
  };
  modal: {
    /** Name of the click-outside button behind a dialog panel. */
    backdropLabel: string;
  };
  theme: {
    /** Name of the theme switch (visible in settings rows, screen-reader only in headers). */
    label: string;
    /** One label per theme preference (TThemePreference). */
    options: { system: string; light: string; dark: string };
  };
  colorSwatch: {
    compactTitle: (position: number) => string;
    comfortableTitle: (position: number) => string;
    /** Accessible name: position, hex value, and the painting slots the color fills. */
    selectLabel: (
      position: number,
      color: string,
      slots?: { primary?: boolean; secondary?: boolean },
    ) => string;
  };
  artwork: {
    /** Title given to an artwork whose title is blank. */
    untitled: string;
    /** Name of the layer every new artwork starts with. */
    backgroundLayer: string;
    copyTitle: (title: string) => string;
    errors: {
      dimensionsOutOfRange: (max: number) => string;
      invalidBackgroundColor: string;
      backgroundPaletteFull: string;
      importedPaletteEmpty: string;
      paletteTooLarge: (max: number) => string;
    };
  };
  /** Errors from reading and writing artwork files (JSON import, PNG export). */
  artworkFile: {
    errors: {
      invalidBase64: string;
      invalidFormat: string;
      unsupportedVersion: string;
      invalidTitle: string;
      invalidDimensions: string;
      paletteMissing: string;
      invalidPaletteEntry: string;
      layersMissing: string;
      layerInvalid: (position: number) => string;
      layerInvalidId: (position: number) => string;
      layerInvalidName: (position: number) => string;
      layerMissingCompactData: (name: string) => string;
      layerInvalidLength: (name: string) => string;
      layerMissingPixelData: (name: string) => string;
      layerPaletteOutOfRange: (name: string) => string;
      invalidReferenceImage: string;
      canvasUnavailable: string;
      invalidJson: string;
    };
  };
}

export interface IGalleryContent {
  screen: {
    title: string;
    intro: string;
    importJson: string;
    newArtwork: string;
  };
  grid: {
    empty: string;
  };
  card: {
    clone: string;
    delete: string;
    confirmDelete: string;
    /** Accessible name of the inline rename field. */
    titleLabel: string;
  };
  create: {
    title: string;
    titleLabel: string;
    backgroundLabel: string;
    backgroundHint: string;
    backgroundAriaLabel: string;
    maxSize: (max: number) => string;
    /** Inline error on a width or height field outside 1…max or not a whole number. */
    sizeRange: (max: number) => string;
    submit: string;
    submitting: string;
  };
  import: {
    success: string;
    failed: string;
  };
  errors: {
    load: string;
    create: string;
    import: string;
    rename: string;
    clone: string;
    delete: string;
  };
}

export type TShiftDirectionKey = "up" | "down" | "left" | "right";

export interface ISettingsMenuRow {
  label: string;
  hint: string;
}

export interface IEditorContent {
  route: {
    missingId: string;
  };
  screen: {
    notFound: string;
    loadFailed: string;
    /** Browser tab title for an open artwork. */
    documentTitle: (artworkTitle: string) => string;
    backToGallery: string;
    loading: string;
  };
  viewport: {
    label: string;
  };
  toolbar: {
    back: string;
    groupLabel: string;
    undo: IIconControl;
    redo: IIconControl;
    pan: IIconControl;
    bucket: IIconControl;
    zoomOut: IIconControl;
    zoomIn: IIconControl;
    shift: IIconControl;
    layers: IIconControl;
    settings: IIconControl;
    slot: {
      primary: string;
      secondary: string;
      label: (slot: string) => string;
      title: string;
    };
  };
  paletteRow: {
    groupLabel: string;
    edit: string;
  };
  paletteModal: {
    title: string;
    swatches: string;
    selectedColor: string;
    selectedColorLabel: string;
    addColor: string;
    newColorLabel: string;
    paletteFull: string;
  };
  shiftOverlay: {
    closeLabel: string;
    dialogLabel: string;
    groupLabel: string;
    directions: Record<TShiftDirectionKey, ILabeledControl>;
  };
  settings: {
    titles: {
      menu: string;
      canvasSize: string;
      imageDetail: string;
      importExport: string;
    };
    backLabel: string;
    closeLabel: string;
    navLabel: string;
    menu: {
      grid: { label: string; show: string; hide: string };
      referenceImage: { label: string; show: string; hide: string; unavailable: string };
      loadImage: ISettingsMenuRow;
      canvasSize: { label: string; hint: (width: number, height: number) => string };
      export: ISettingsMenuRow;
      imageDetail: ISettingsMenuRow;
    };
    canvasSize: {
      hint: string;
      invalidSize: string;
      outOfRange: string;
      confirmShrink: string;
    };
    imageDetail: {
      noIntersection: string;
      summary: (compositePixels: number, visibleCells: number) => string;
      emptyViewport: string;
      allTransparent: string;
      paletteEntry: (index: number) => string;
      percent: (value: number) => string;
    };
    export: {
      hint: string;
      sectionLabel: string;
      title: string;
      png: string;
      json: string;
      jsonDone: string;
      pngDone: string;
      pngFailed: string;
    };
  };
  layers: {
    /** Name of a duplicated layer. */
    copyName: (name: string) => string;
    title: string;
    closeLabel: string;
    add: string;
    footer: string;
    newLayerName: (position: number) => string;
    item: {
      dragTitle: string;
      reorder: string;
      show: string;
      hide: string;
      duplicate: string;
      rename: string;
    };
    renameModal: {
      title: string;
      nameLabel: string;
      /** Inline error when the name is blank. */
      emptyError: string;
    };
  };
  toasts: {
    /** Stable text so the toast stack can dedupe repeats by exact message. */
    hiddenLayer: string;
  };
  referenceImage: {
    errors: {
      read: string;
      decode: string;
      canvas: string;
    };
  };
}
