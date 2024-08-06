declare module 'splitpanes' {
  import type { VNode, VNodeProps } from 'vue';

  interface Dimension {
    min: number;
    max: number;
    size: number;
  }

  export interface SplitpanesProps {
    /**
     * The orientation of the panes splitting.
     * Vertical by default, meaning the splitters are vertical, but you can resize horizontally
     * @default false
     */
    horizontal?: boolean;
    /**
     * Displays the first splitter when set to true. This allows maximizing the first pane on splitter double click.
     * @default false
     */
    firstSplitter?: boolean;
    /**
     * Whether it should push the next splitter when dragging a splitter until it reached another one.
     * @default true
     */
    pushOtherPanes?: boolean;
    /**
     * Double click on splitter to maximize the next pane.
     * @default true
     */
    dblClickSplitter?: boolean;
    /**
     * Supports Right to left direction.
     * @default false
     */
    rtl?: boolean;
    /**
     * has no parameter and fires when splitpanes is ready
     */
    onReady?: () => void;
    /**
     * returns an array of all the panes objects with their dimensions, and fires while resizing (on mousemove/touchmove)
     */
    onResize?: (dimesions: Dimension[]) => void;
    /**
     * returns an array of all the panes objects with their dimensions, and fires once when the resizing stops after user drag (on mouseup/touchend).
     * This event is also fired after the internal resizing of panes that occurs after adding or removing a pane.
     */
    onResized?: (dimesions: Dimension[]) => void;
    /**
     * returns the clicked pane object with its dimensions.
     */
    onPaneClick?: (pane: Pane) => void;
    /**
     * returns the maximized pane object with its dimensions.
     */
    onPaneMaximize?: (pane: Pane) => void;
    /**
     * returns an object containing the index of the added pane and the new array of panes after resize.
     */
    onPaneAdd?: (panes: { index: number; panes: Dimension[] }) => void;
    /**
     * returns an object containing the removed pane and an array of all the remaining panes objects with their dimensions after resize.
     */
    onPaneRemove?: (removed: { removed: Pane; panes: Dimension[] }) => void;
    /**
     * returns the next pane object (with its dimensions) directly after the clicked splitter.
     * This event is only emitted if dragging did not occur between mousedown and mouseup.
     */
    onSplitterClick?: (pane: Pane) => void;
  }
  export const Splitpanes: {
    new (): {
      $props: VNodeProps & SplitpanesProps;
      $slots: {
        default(): VNode[];
      };
    };
  };

  export interface PaneProps {
    /**
     * @default null
     */
    size?: number | string;
    /**
     * @default 0
     */
    minSize?: number | string;
    /**
     * @default 100
     */
    maxSize?: number | string;
  }

  export const Pane: {
    new (): {
      $props: VNodeProps & PaneProps;
      $slots: {
        default(): VNode[];
      };
    };
  };
}
