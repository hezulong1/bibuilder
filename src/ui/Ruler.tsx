import type { ElementSize, Position } from '@vueuse/core';
import type { CSSProperties } from 'vue';

// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale: number) => {
  if (scale <= 0.25) return 40;
  if (scale <= 0.5) return 20;
  if (scale <= 1) return 10;
  if (scale <= 2) return 5;
  if (scale <= 4) return 2;
  return 1;
};

const FONT_SCALE = 0.83; // 10 / 12

export const renderRuler = (
  ctx: CanvasRenderingContext2D,
  start: number,
  selectStart: number,
  selectLength: number,
  options: {
    scale: number;
    width: number;
    height: number;
    ratio: number;
    palette: any;
    startNumX: number;
    endNumX: number;
    startNumY: number;
    endNumY: number;
  },
  h?: boolean, // 横向为true,纵向缺省
) => {
  const { scale, width, height, ratio, palette } = options;
  const { bgColor, fontColor, shadowColor, longfgColor, shortfgColor } = palette;
  // console.log(start, 'startstart')
  const startNum = h ? options.startNumX : options.startNumY;
  const endNum = h ? options.endNumX : options.endNumY;
  // 缩放ctx, 以简化计算
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);

  // 1. 画标尺底色
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. 画阴影
  if (selectLength) {
    const shadowX = (selectStart - start) * scale; // 阴影起点坐标
    const shadowWidth = selectLength * scale; // 阴影宽度
    ctx.fillStyle = shadowColor;
    h
      ? ctx.fillRect(shadowX, 0, shadowWidth, (height * 3) / 8)
      : ctx.fillRect(0, shadowX, (width * 3) / 8, shadowWidth);
  }

  const gridSize = getGridSize(scale); // 每小格表示的宽度
  const gridSize10 = gridSize * 10; // 每大格表示的宽度
  const gridPixel = gridSize * scale;
  const gridPixel10 = gridSize10 * scale;

  const startValue = Math.floor(start / gridSize) * gridSize; // 绘制起点的刻度(略小于start, 且是gridSize的整数倍)
  const startValue10 = Math.floor(start / gridSize10) * gridSize10; // 长间隔绘制起点的刻度(略小于start, 且是gridSize10的整数倍)

  const offsetX = ((startValue - start) / gridSize) * gridPixel; // 起点刻度距离ctx原点(start)的px距离
  const offsetX10 = ((startValue10 - start) / gridSize10) * gridPixel10; // 长间隔起点刻度距离ctx原点(start)的px距离
  const endValue = start + Math.ceil((h ? width : height) / scale); // 终点刻度(略超出标尺宽度即可)

  // 3. 画刻度和文字(因为刻度遮住了阴影)
  ctx.beginPath(); // 一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制

  ctx.fillStyle = fontColor;
  ctx.strokeStyle = longfgColor;

  // 长间隔和短间隔需要两次绘制，才可以完成不同颜色的设置；分开放到两个for循环是为了节省性能，因为如果放到一个for循环的话，每次循环都会重新绘制操作dom
  // 绘制长间隔和文字
  for (let value = startValue10, count = 0; value < endValue; value += gridSize10, count++) {
    if (value >= startNum && value <= endNum) {
      const x = offsetX10 + count * gridPixel10 + 0.5; // prevent canvas 1px line blurry
      h ? ctx.moveTo(x, 0) : ctx.moveTo(0, x);
      ctx.save();
      h ? ctx.translate(x, height * 0.4) : ctx.translate(width * 0.4, x);
      if (!h) {
        ctx.rotate(-Math.PI / 2); // 旋转 -90 度
      }
      ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio);
      ctx.fillText(value.toString(), 4 * ratio, 7 * ratio);
      ctx.restore();
      h ? ctx.lineTo(x, (height * 9) / 16) : ctx.lineTo((width * 9) / 16, x);
    }
    ctx.stroke();
    ctx.closePath();

    // 绘制短间隔
    ctx.beginPath();
    ctx.strokeStyle = shortfgColor;
    for (let value = startValue, count = 0; value < endValue; value += gridSize, count++) {
      if (value >= startNum && value <= endNum) {
        const x = offsetX + count * gridPixel + 0.5; // prevent canvas 1px line blurry
        h ? ctx.moveTo(x, 0) : ctx.moveTo(0, x);
        if (value % gridSize10 !== 0) {
          h ? ctx.lineTo(x, (Number(height)) / 4) : ctx.lineTo((Number(width)) / 4, x);
        }
      }
    }
    ctx.stroke();
    ctx.closePath();

    // 恢复ctx matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
};

interface RulerPalette {
  bgColor?: string;
  lineColor?: string;
}

export interface PaletteType {
  bgColor?: string;
  longfgColor?: string;
  shortfgColor?: string;
  fontColor?: string;
  shadowColor?: string;
  lineColor?: string;
  borderColor?: string;
  cornerActiveColor?: string;
  menu?: MenuType;
}

export interface MenuType {
  bgColor?: string;
  dividerColor?: string;
  listItem?: {
    textColor?: string;
    hoverTextColor?: string;
    disabledTextColor?: string;
    bgColor?: string;
    hoverBgColor?: string;
  };
}

export type RulerShadow = ElementSize & Position;

export interface ShadowType {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface lineType {
  h?: Array<number>;
  v?: Array<number>;
}

export interface RulerInstance {
  draw(): void;
}

const Ruler = defineComponent({
  name: 'Ruler',
  props: {
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'horizontal',
    },

    zoom: Number,
    start: Number,
    width: Number,
    height: Number,

    fillColor: String,
    textColor: String,
    tickColor: String,
  },
  setup(props, { expose }) {
    const canvasRef = ref<HTMLCanvasElement>();
    const isVerticalRef = computed(() => props.orientation === 'vertical');

    const isDrawing = ref(false);
    const widthRef = ref(0);
    const heightRef = ref(0);

    const canvasStyle = computed(() => {
      const s: CSSProperties = {};
      if (widthRef.value) {
        s.width = `${widthRef.value}px`;
      }
      if (heightRef.value) {
        s.height = `${heightRef.value}px`;
      }
      return s;
    });
    const zoomRef = computed(() => props.zoom || 1);
    const maximumSize = computed(() => isVerticalRef.value ? heightRef.value : widthRef.value);
    const intervalSize = computed(() => {
      const { value: zoom } = zoomRef;
      if (zoom <= 0.25) return 40;
      else if (zoom > 0.25 && zoom <= 0.5) return 20;
      else if (zoom > 0.5 && zoom <= 1) return 10;
      else if (zoom > 1 && zoom <= 2) return 5;
      else if (zoom > 2 && zoom <= 4) return 2;
      else return 1;
    });

    // Canvas
    // ----------------------------------------
    let canvasContext: CanvasRenderingContext2D | undefined;

    function draw() {
      if (!canvasContext) return;
      if (isDrawing.value) return;

      isDrawing.value = true;

      const { fillColor, textColor, tickColor } = props;
      const start = props.start || 0;
      const scale = _getScale();

      const { value: isVertical } = isVerticalRef;
      const { value: width } = widthRef;
      const { value: height } = heightRef;
      const { value: zoom } = zoomRef;

      // canvasContext.save();
      canvasContext.scale(scale, scale);
      canvasContext.clearRect(0, 0, width * scale, height * scale);
      if (fillColor) {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(0, 0, width * scale, height * scale);
      }

      // size
      let originMaximum = maximumSize.value;
      // unit
      let originInterval = intervalSize.value;
      let brandOriginInterval = originInterval * 10;
      // zoomUnit
      let zoomedInterval = originInterval * zoom;
      let brandZoomedInterval = zoomedInterval * 10;
      // minRange
      let startValue = Math.floor(start / zoom / originInterval) * originInterval;
      let brandStartValue = Math.floor(start / zoom / brandOriginInterval) * brandOriginInterval;

      let offsetValue = ((startValue - start) / originInterval) * zoomedInterval;
      let brandOffsetValue = ((brandStartValue - start) / brandOriginInterval) * brandZoomedInterval;
      // maxRange
      let endValue = start + Math.ceil(originMaximum / zoom);

      // canvasContext.translate(0.5, 0.5);
      canvasContext.beginPath();
      if (textColor) canvasContext.fillStyle = textColor;
      if (tickColor) canvasContext.strokeStyle = tickColor;

      // 绘制长刻度
      let brandTick = brandStartValue;
      let brandIndex = 0;

      while (brandTick < endValue) {
        let pos = brandOffsetValue + brandIndex * brandZoomedInterval + 0.5;

        if (isVertical) {
          canvasContext.moveTo(0, pos);
          canvasContext.save();
          canvasContext.translate(width * 40 / 100, pos);
          canvasContext.rotate(Math.PI / -2);
        } else {
          canvasContext.moveTo(pos, 0);
          canvasContext.save();
          canvasContext.translate(pos, height * 40 / 100);
        }

        // canvasContext.scale(FONT_SCALE / scale, FONT_SCALE / scale);
        canvasContext.fillText(brandTick.toString(), 4 * scale, 8 * scale);
        // canvasContext.fillText(brandTick.toString(), 4, 8);
        canvasContext.restore();

        if (isVertical) {
          canvasContext.lineTo(width * 80 / 100, pos); // 9 / 16
        } else {
          canvasContext.lineTo(pos, height * 80 / 100);
        }

        canvasContext.stroke();
        canvasContext.closePath();

        // #region 绘制短刻度
        let tick = startValue;
        let index = 0;
        canvasContext.beginPath();

        while (tick < endValue) {
          let pos = offsetValue + index * zoomedInterval + 0.5;
          let notBrand = tick % brandOriginInterval !== 0;
          let inMiddle = index % 5 === 0;

          if (isVertical) {
            canvasContext.moveTo(0, pos);
            notBrand && canvasContext.lineTo(width / (inMiddle ? 2 : 4), pos);
          } else {
            canvasContext.moveTo(pos, 0);
            notBrand && canvasContext.lineTo(pos, height / (inMiddle ? 2 : 4));
          }

          tick += originInterval;
          index += 1;
        }
        canvasContext.stroke();
        canvasContext.closePath();
        // #endregion

        canvasContext.setTransform(1, 0, 0, 1, 0, 0);

        brandTick += brandOriginInterval;
        brandIndex += 1;
      }

      isDrawing.value = false;
    }

    function onResize() {
      const canvasDomNode = canvasRef.value;
      const { width: fromWidth, height: fromHeight } = props;

      if (fromWidth) {
        widthRef.value = fromWidth;
      }
      if (fromHeight) {
        heightRef.value = fromHeight;
      }

      if (Number.isNaN(widthRef.value)) {
        __DEV__ && console.warn('`widthRef.value` is `NaN`.');
        widthRef.value = 0;
      }
      if (Number.isNaN(heightRef.value)) {
        __DEV__ && console.warn('`heightRef.value` is `NaN`.');
        heightRef.value = 0;
      }

      const scale = _getScale();

      if (canvasDomNode) {
        canvasDomNode.width = widthRef.value * scale;
        canvasDomNode.height = heightRef.value * scale;
      }

      requestAnimationFrame(draw);
    }

    tryOnMounted(() => {
      canvasContext = canvasRef.value?.getContext('2d')!;
      canvasContext.lineWidth = 1;
      canvasContext.textBaseline = 'middle';
      canvasContext.font = `12px -apple-system, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif`;

      onResize();
    });

    watch(() => [props.zoom, props.start, props.width, props.height], onResize);

    expose({ draw });
    // const handle = (e: MouseEvent, key: string) => {
    //   const getValueByOffset = (offset: number, start: number, scale: number) =>
    //     Math.round(start + offset / scale);
    //   const offset = props.vertical ? e.offsetY : e.offsetX;
    //   const value = getValueByOffset(offset, props.start!, props.scale!);
    //   switch (key) {
    //     case 'click':
    //       emit('onAddLine', value);
    //       break;
    //     case 'enter':
    //       emit('update:valueNum', value);
    //       emit('update:showIndicator', true);
    //       break;
    //     default:
    //       emit('update:valueNum', value);
    //       break;
    //   }
    // };

    const dprMedia = [
      'only screen and (min--moz-device-pixel-ratio: 1.3)',
      'only screen and (-o-min-device-pixel-ratio: 2.6/2)',
      'only screen and (-webkit-min-device-pixel-ratio: 1.3)',
      'only screen and (min-device-pixel-ratio: 1.3)',
      'only screen and (min-resolution: 1.3dppx)',
    ].join(',');

    function _getScale() {
      if (window.devicePixelRatio > 1) return window.devicePixelRatio;
      const mq = window.matchMedia(dprMedia);
      return mq.matches ? 2 : 1;
    }

    return () => <canvas ref={canvasRef} class="ui-Ruler" style={canvasStyle.value} />;
  },
});

// Line
// ----------------------------------------
const RulerLine = defineComponent({
  name: 'RulerLine',
  props: {
    zoom: {
      type: Number,
      default: 1,
    },
    color: String,
    disabled: Boolean,
    disabledColor: String,
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'horizontal',
    },
    basicValue: {
      type: Number,
      default: 0,
    },
    modelValue: Number,
  },
  emits: {
    dragstart: (value: number) => true,
    dragmove: (value: number) => true,
    dragend: (value: number) => true,
    'delete': () => true,
  },
  setup(props, { emit }) {
    const currentRef = ref(props.modelValue || 0);

    const rootStyle = computed(() => {
      const s: CSSProperties = {};
      s['--offset'] = currentRef.value - props.basicValue;
      return s;
    });

    const lineStyle = computed(() => {
      const s: CSSProperties = {};
      s.background = props.color;

      if (props.orientation === 'horizontal') {
        s.cursor = 'ew-resize';
        s.width = '1px';
      } else if (props.orientation === 'vertical') {
        s.cursor = 'ns-resize';
        s.height = '1px';
      }

      return s;
    });

    function handleDelete() {
      emit('delete');
    }

    const asPosition = (e: MouseEvent) => {
      let pos = 0;
      let orientation = props.orientation;

      if (orientation === 'horizontal') {
        pos = e.clientX;
      } else if (orientation === 'vertical') {
        pos = e.clientY;
      }

      return pos;
    };

    const handleMouseDown = (e: MouseEvent) => {
      let start = asPosition(e);
      emit('dragstart', start);

      const onDragMove = (e: MouseEvent) => {
        let current = asPosition(e);
        let next = Math.round(currentRef.value + (current - start) / props.zoom);
        emit('dragmove', next);
        currentRef.value = next;
      };
      const onDragEnd = () => {
        emit('dragend', currentRef.value);
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
      };

      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
    };

    return () => (
      <div class="ui-RulerLine relative" style={rootStyle.value}>
        <div class="line" style={lineStyle.value} onClick={handleMouseDown} />
        <div class="absolute top-0 left-0 z-1 flex items-center gap-1">
          <div class="inline-flex items-center bg-white text-black p-1">{ currentRef.value }</div>
          <div class="i-vscode-close" onClick={handleDelete} />
        </div>
      </div>
    );
  },
});

// Wrapper
// ----------------------------------------
const RulerWrapper = defineComponent({
  name: 'RulerWrapper',
  props: {
    scale: Number,
    ratio: Number,
    thick: Number,
    startNumX: Number,
    endNumX: Number,
    startNumY: Number,
    endNumY: Number,
    palette: Object as PropType<RulerPalette>,
    vertical: {
      type: Boolean,
      default: true,
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    start: {
      type: Number,
      default: 0,
    },
    lines: {
      type: Array as PropType<Array<number>>,
      default: () => [],
    },
    selectStart: {
      type: Number,
    },
    selectLength: {
      type: Number,
    },
    isShowReferLine: {
      type: Boolean,
    },
  },
  setup(props) {
    const showIndicator = ref(false);
    const valueNum = ref(0);
    const rwClassName = computed(() => {
      const className = props.vertical ? 'v-container' : 'h-container';
      return className;
    });
    const rwStyle = computed(() => {
      const hContainer = {
        width: `calc(100% - ${props.thick}px)`,
        height: `${props.thick! + 1}px`,
        left: `${props.thick}` + 'px',
      };
      const vContainer = {
        width: `${props.thick && props.thick + 1}px`,
        height: `calc(100% - ${props.thick}px)`,
        top: `${props.thick}` + 'px',
      };
      return props.vertical ? vContainer : hContainer;
    });

    const indicatorStyle = computed(() => {
      const indicatorOffset = (valueNum.value - props.start) * props.scale!;
      let positionKey = 'top';
      let boderKey = 'borderLeft';
      positionKey = props.vertical ? 'top' : 'left';
      boderKey = props.vertical ? 'borderBottom' : 'borderLeft';
      return {
        [positionKey]: indicatorOffset + 'px',
        [boderKey]: `1px solid ${props.palette?.lineColor}`,
      };
    });

    const handleNewLine = (value: number) => {
      props.lines.push(value);
    };
    const handleLineRelease = (value: number, index: number) => {
      // 左右或上下超出时, 删除该条对齐线
      const offset = value - props.start;
      const maxOffset = (props.vertical ? props.height : props.width) / props.scale!;
      if (offset < 0 || offset > maxOffset) {
        handleLineRemove(index);
      } else {
        props.lines[index] = value;
      }
    };
    const handleLineRemove = (index: any) => {
      props.lines.splice(index, 1);
    };
    return {
      showIndicator,
      valueNum,
      rwClassName,
      rwStyle,
      indicatorStyle,
      handleNewLine,
      handleLineRelease,
      handleLineRemove,
    };
  },
});

// Root
// ----------------------------------------
const RulerRoot = defineComponent({
  name: 'RulerRoot',
  props: {
    eyeIcon: {
      type: String,
    },
    closeEyeIcon: {
      type: String,
    },
    scale: {
      type: Number,
      default: 1,
    },
    ratio: {
      type: Number,
    // default: window.devicePixelRatio || 1
    },
    thick: {
      type: Number,
      default: 16,
    },
    palette: Object as PropType<RulerPalette>,
    startX: {
      type: Number,
    },
    startY: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    shadow: {
      type: Object as PropType<ShadowType>,
      default: () => ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }),
    },

    lines: {
      type: Object as PropType<lineType>,
      default: () => ({
        h: [],
        v: [],
      }),
    },
    isShowReferLine: {
      type: Boolean,
      default: true,
    },
    startNumX: {
      type: Number,
      default: Number.NEGATIVE_INFINITY,
    },
    endNumX: {
      type: Number,
      default: Number.POSITIVE_INFINITY,
    },
    startNumY: {
      type: Number,
      default: Number.NEGATIVE_INFINITY,
    },
    endNumY: {
      type: Number,
      default: Number.POSITIVE_INFINITY,
    },
  },
  emits: ['onCornerClick'],
  setup(props, { emit }) {
    let showReferLine = ref(true);
    showReferLine.value = props.isShowReferLine;
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
    const paletteCpu = computed(() => {
      function merge(obj: { [key: string]: any }, o: { [key: string]: any }) {
        Object.keys(obj).forEach((key) => {
          if (key && obj.hasOwnProperty(key)) {
            if (typeof o[key] === 'object') {
              obj[key] = merge(obj[key], o[key]);
            } else if (o.hasOwnProperty(key)) {
              obj[key] = o[key];
            }
          }
        });
        return obj;
      }
      const finalObj = merge(
        {
          bgColor: 'rgba(225,225,225, 0)', // ruler bg color
          longfgColor: '#BABBBC', // ruler longer mark color
          shortfgColor: '#C8CDD0', // ruler shorter mark color
          fontColor: '#7D8694', // ruler font color
          shadowColor: '#E8E8E8', // ruler shadow color
          lineColor: '#EB5648',
          borderColor: '#DADADC',
          cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
          menu: {
            bgColor: '#fff',
            dividerColor: '#DBDBDB',
            listItem: {
              textColor: '#415058',
              hoverTextColor: '#298DF8',
              disabledTextColor: 'rgba(65, 80, 88, 0.4)',
              bgColor: '#fff',
              hoverBgColor: '#F2F2F2',
            },
          },
        },
        props.palette || {},
      );
      return finalObj;
    });
    const cornerStyle = computed(() => ({
      backgroundImage: showReferLine.value
        ? `url(${props.eyeIcon})`
        : `url(${props.closeEyeIcon})`,
      width: props.thick + 'px',
      height: props.thick + 'px',
      borderRight: `1px solid ${paletteCpu.value.borderColor}`,
      borderBottom: `1px solid ${paletteCpu.value.borderColor}`,
    }));
    const onCornerClick = (e: MouseEvent) => {
      showReferLine.value = !showReferLine.value;
      emit('onCornerClick', showReferLine.value);
    };
    watch([() => props.isShowReferLine], () => {
      showReferLine.value = props.isShowReferLine;
    });
    return {
      showReferLine,
      paletteCpu,
      cornerStyle,
      onCornerClick,
    };
  },
  render() {
    return null;
  },
});

// exports
// ----------------------------------------
Ruler.Line = RulerLine;
Ruler.Wrapper = RulerWrapper;
Ruler.Root = RulerRoot;

export {
  type RulerPalette,
  Ruler,
  RulerLine,
  RulerRoot,
};

export default Ruler;
