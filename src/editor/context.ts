import { injectionEditorContext } from './constants';

export function useEditorContext() {
  const $editor = injectLocal(injectionEditorContext)!;
  const $nav = $editor.nav;

  return {
    $editor,
    $nav,
  };
}

interface RendererState {
  systemScale: number;
  userScale: number;
  lockScale: boolean;

  isDragging: boolean;

  backgroundColor: string | undefined;
  backgroundImage: string | undefined;
  backgroundPosition: string | undefined;
}

interface MousePosition {
  startX: number;
  startY: number;
  x: number;
  y: number;
}

export const useEditorStore = createGlobalState(() => {
  const renderer = reactive<RendererState>({
    systemScale: 1,
    userScale: 1,
    lockScale: false,

    isDragging: false,

    backgroundColor: undefined,
    backgroundImage: undefined,
    backgroundPosition: undefined,
  });

  const mousePosition = reactive<MousePosition>({
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
  });

  const temporary = ref<any>();
  const contextmenuVisible = ref(false);

  function syncRendererState(state: Partial<RendererState>) {
    Object.entries(state).forEach(([key, value]) => {
      // @ts-expect-error 不止如何写
      renderer[key as keyof RendererState] = value;
    });
  }

  function syncMousePosition(position: Partial<MousePosition>) {
    if (typeof position.startX !== 'undefined') mousePosition.startX = position.startX;
    if (typeof position.startY !== 'undefined') mousePosition.startY = position.startY;
    if (typeof position.x !== 'undefined') mousePosition.x = position.x;
    if (typeof position.y !== 'undefined') mousePosition.y = position.y;
  }

  return {
    syncRendererState,
    syncMousePosition,

    contextmenuVisible,
    temporary,
  };
});
