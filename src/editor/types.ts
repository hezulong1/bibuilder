export interface EditorNavigator {
  total: ComputedRef<number>;

  hasNext: ComputedRef<boolean>;
  hasPrev: ComputedRef<boolean>;
}

export interface EditorContext {
  nav: EditorNavigator;
}
