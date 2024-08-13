import { isClient } from '@vueuse/core';

export const windowSize = useWindowSize();
export const magicKeys = useMagicKeys();
export const fullscreen = useFullscreen(isClient ? document.body : null);
export const mouse = useMouse();
