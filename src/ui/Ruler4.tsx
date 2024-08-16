import type { CSSProperties } from 'vue';

export interface RulerInstance {
  draw(): void;
}

const Ruler4 = defineComponent({
  name: 'Ruler4',
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

      canvasContext.save();
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
      // let brandOriginInterval = originInterval * 10;
      // zoomUnit
      let zoomedInterval = originInterval * zoom;
      // let brandZoomedInterval = zoomedInterval * 10;
      // minRange
      let startValue = Math.floor(start / originInterval) * originInterval;
      // let brandStartValue = Math.floor(start / zoom / brandOriginInterval) * brandOriginInterval;

      let offsetValue = ((startValue - start) / originInterval) * zoomedInterval;
      // let brandOffsetValue = ((brandStartValue - start) / brandOriginInterval) * brandZoomedInterval;
      // maxRange
      let endValue = start + Math.ceil(originMaximum);

      canvasContext.translate(0.5, 0.5);
      canvasContext.beginPath();
      if (textColor) canvasContext.fillStyle = textColor;
      if (tickColor) canvasContext.strokeStyle = tickColor;

      const tickList: number[] = [];

      let curTick = startValue;

      while (curTick <= endValue) {
        tickList.push(curTick);
        curTick += zoomedInterval;
      }

      for (let i = 0, l = tickList.length; i < l; i++) {
        const pos = tickList[i] + offsetValue;
        const isPrimary = i % 10 === 0;
        const isCenter = i % 5 === 0;
        const percent = isPrimary ? 80 : isCenter ? 50 : 35;

        const [sx, sy] = isVertical ? [0, pos] : [pos, 0];
        const [ex, ey] = isVertical ? [width * percent / 100, pos] : [pos, height * percent / 100];

        canvasContext.moveTo(sx, sy);

        if (isPrimary) {
          const [tx, ty] = isVertical ? [width * 40 / 100, pos] : [pos, height * 40 / 100];

          canvasContext.save();
          canvasContext.translate(tx, ty);

          if (isVertical) {
            canvasContext.rotate(Math.PI / -2);
          }

          canvasContext.fillText((i * originInterval).toString(), 4, 8);
          canvasContext.restore();
        }

        canvasContext.lineTo(ex, ey);
        canvasContext.stroke();
        canvasContext.closePath();
      }

      // 绘制长刻度
      // let brandTick = brandStartValue;
      // let brandIndex = 0;

      // while (brandTick < endValue) {
      //   let pos = brandOffsetValue + brandIndex * brandZoomedInterval + 0.5;

      //   if (isVertical) {
      //     canvasContext.moveTo(0, pos);
      //     canvasContext.save();
      //     canvasContext.translate(width * 40 / 100, pos);
      //     canvasContext.rotate(Math.PI / -2);
      //   } else {
      //     canvasContext.moveTo(pos, 0);
      //     canvasContext.save();
      //     canvasContext.translate(pos, height * 40 / 100);
      //   }

      //   // canvasContext.scale(FONT_SCALE / scale, FONT_SCALE / scale);
      //   canvasContext.fillText(brandTick.toString(), 4 * scale, 8 * scale);
      //   // canvasContext.fillText(brandTick.toString(), 4, 8);
      //   canvasContext.restore();

      //   if (isVertical) {
      //     canvasContext.lineTo(width * 80 / 100, pos); // 9 / 16
      //   } else {
      //     canvasContext.lineTo(pos, height * 80 / 100);
      //   }

      //   canvasContext.stroke();
      //   canvasContext.closePath();

      //   // #region 绘制短刻度
      //   let tick = startValue;
      //   let index = 0;
      //   canvasContext.beginPath();

      //   while (tick < endValue) {
      //     let pos = offsetValue + index * zoomedInterval + 0.5;
      //     let notBrand = tick % brandOriginInterval !== 0;
      //     let inMiddle = index % 5 === 0;

      //     if (isVertical) {
      //       canvasContext.moveTo(0, pos);
      //       notBrand && canvasContext.lineTo(width / (inMiddle ? 2 : 4), pos);
      //     } else {
      //       canvasContext.moveTo(pos, 0);
      //       notBrand && canvasContext.lineTo(pos, height / (inMiddle ? 2 : 4));
      //     }

      //     tick += originInterval;
      //     index += 1;
      //   }
      //   canvasContext.stroke();
      //   canvasContext.closePath();
      //   // #endregion

      //   canvasContext.setTransform(1, 0, 0, 1, 0, 0);

      //   brandTick += brandOriginInterval;
      //   brandIndex += 1;
      // }
      canvasContext.restore();
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
      if (window.devicePixelRatio > 1) return 3;
      const mq = window.matchMedia(dprMedia);
      return mq.matches ? 3 : 2;
    }

    return () => <canvas ref={canvasRef} class="ui-Ruler" style={canvasStyle.value} />;
  },
});

export {
  Ruler4,
};

export default Ruler4;
