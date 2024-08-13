import type { InjectionKey, UnwrapNestedRefs } from 'vue';
import type { EditorContext } from './types';

export const injectionEditorContext = '$editor-context' as unknown as InjectionKey<UnwrapNestedRefs<EditorContext>>;
