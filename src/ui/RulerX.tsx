import type { CSSProperties } from 'vue';

export interface RulerInstance {
  draw(zoom?: number): void;
}

const RulerX = defineComponent({
  props: {
    vertical: Boolean,
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    start: Number,
    zoom: Number,
  },

  setup(props, { expose }) {
    const canvasRef = ref<HTMLCanvasElement>();
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
    const maximumSize = computed(() => props.vertical ? heightRef.value : widthRef.value);

    let canvasContext: CanvasRenderingContext2D | undefined;
    let isDrawing = false;

    function draw() {
      if (!canvasContext) return;
      if (isDrawing) return;

      isDrawing = true;

      const start = props.start || 0;
      const isVertical = props.vertical;
      const scale = _getScale();

      const { value: width } = widthRef;
      const { value: height } = heightRef;
      const { value: zoom } = zoomRef;

      const canvasDomNode = canvasRef.value!;
      canvasDomNode.width = width * scale;
      canvasDomNode.height = height * scale;

      canvasContext.fillStyle = 'transparent';
      canvasContext.fillRect(0, 0, width * scale, height * scale);
      canvasContext.save();
      canvasContext.scale(scale, scale);
      canvasContext.strokeStyle = 'rgba(255,255,255,.85)';
      canvasContext.fillStyle = 'rgba(255,255,255,.85)';
      canvasContext.translate(0.5, 0.5);
      canvasContext.beginPath();

      // size
      let originMaximum = maximumSize.value;
      // unit
      let originInterval = 5;
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

      canvasContext.restore();
      isDrawing = false;
    }

    function onResize() {
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

    // Util

    const dprMedia = [
      'only screen and (min--moz-device-pixel-ratio: 1.3)',
      'only screen and (-o-min-device-pixel-ratio: 2.6/2)',
      'only screen and (-webkit-min-device-pixel-ratio: 1.3)',
      'only screen and (min-device-pixel-ratio: 1.3)',
      'only screen and (min-resolution: 1.3dppx)',
    ].join(',');

    function _getScale() {
      if (window.devicePixelRatio > 1) return 2;
      const mq = window.matchMedia(dprMedia);
      return mq.matches ? 2 : 1;
    }

    return () => <canvas ref={canvasRef} class="ui-Ruler" style={canvasStyle.value} />;
  },
});

export default RulerX;
