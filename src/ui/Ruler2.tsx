interface DrawRulerOptions {
  scrollPos?: number;
  zoom?: number;
  selectedRanges?: number[][];
  marks?: number[];
  unit?: number;
  segment?: number;
}

export const Ruler2 = defineComponent({
  props: {
    type: {
      type: String,
      default: 'horizontal',
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    unit: {
      type: Number,
      default: 50,
    },
    zoom: {
      type: Number,
      default: 1,
    },
    direction: {
      type: String as PropType<'start' | 'center' | 'end'>,
      default: 'end',
    },
    textAlign: {
      type: String as PropType<'left' | 'center' | 'right'>,
    },

    backgroundColor: String,
    axisTickColor: String,
    axisLabelColor: String,
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement>();
    const zoomRef = ref(props.zoom || 0);
    const isHorizontal = computed(() => props.type === 'horizontal');

    // Private
    let canvasContext: CanvasRenderingContext2D | undefined;

    function resize(nextZoom?: number) {
      const rulerScale = _getScale();
      if (!canvasRef.value) return;
      canvasRef.value.width = props.width * rulerScale;
      canvasRef.value.height = props.height * rulerScale;

      draw({ zoom: nextZoom });
    }

    function draw(options: DrawRulerOptions = {}) {
      if (!canvasContext) return;

      const {
        zoom: nextZoom = zoomRef.value,
        unit = props.unit,
      } = options;
      console.log(nextZoom);
      zoomRef.value = nextZoom;

      const rulerScale = _getScale();

      if (props.backgroundColor) {
        canvasContext.rect(0, 0, props.width * rulerScale, props.height * rulerScale);
        canvasContext.fillStyle = props.backgroundColor;
        canvasContext.fill();
      }

      canvasContext.save();
      canvasContext.scale(rulerScale, rulerScale);

      canvasContext.lineWidth = 1;
      canvasContext.font = `12px -apple-system, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif`;
      canvasContext.textBaseline = 'middle';
      if (props.axisTickColor) {
        canvasContext.strokeStyle = props.axisTickColor;
      }
      if (props.axisLabelColor) {
        canvasContext.fillStyle = props.axisLabelColor;
      }

      canvasContext.translate(0.5, 0.5);
      canvasContext.beginPath();

      const size = isHorizontal.value ? props.width : props.height;
      const barSize = isHorizontal.value ? props.height : props.width;
      const zoomUnit = nextZoom * unit;
      const minRange = 0;
      const maxRange = Math.ceil(size / zoomUnit);
      const length = maxRange - minRange;
      const values: Array<{
        color: string;
        backgroundColor?: string;
        offset: number[];
        value: number;
        text: string;
        textSize: number;
      }> = [];

      for (let i = 0; i <= length; ++i) {
        const value = (i + minRange) * unit;
        let text = `${value}`;

        const textSize = canvasContext.measureText(text).width;

        values.push({
          color: props.axisLabelColor || '',
          offset: [0, 0],
          backgroundColor: 'transparent',
          value,
          text,
          textSize,
        });
      }

      let segment = 10;
      let range = [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];

      for (let i = 0; i <= length; ++i) {
        const value = i + minRange;
        const startValue = value * unit;
        const startPos = startValue * nextZoom;

        for (let j = 0; j < segment; ++j) {
          const pos = startPos + j / segment * zoomUnit;
          const value = startValue + j / segment * unit;
          const isPrimary = j % segment === 0;
          const isCenter = (j % (segment / 2)) === 0;

          if (pos < 0 || pos >= size || value < range[0] || value > range[1]) {
            continue;
          }

          // const lineSize = j === 0
          //   ? barSize
          //   : (j % 2 === 0 ? 10 : 7);

          const lineSize = isPrimary ? barSize : isCenter ? (barSize / 2) : (barSize / 4);

          const [x1, y1] = isHorizontal.value
            ? [pos, 0]
            : [0, pos];

          const [x2, y2] = isHorizontal.value ? [x1, y1 + lineSize] : [x1 + lineSize, y1];

          canvasContext.moveTo(x1, y1);
          canvasContext.lineTo(x2, y2);
        }
      }
      canvasContext.stroke();
      canvasContext.beginPath();

      values.forEach(({ value, offset, backgroundColor, color, text, textSize }) => {
        if (value < 0 || !canvasContext) {
          return;
        }
        const startPos = value * nextZoom;

        if (startPos < -zoomUnit || startPos >= size + unit * nextZoom || value < range[0] || value > range[1]) {
          return;
        }

        let origin = barSize * 0.75;

        const [startX, startY] = isHorizontal.value
          ? [startPos + -1 * -3, origin]
          : [origin, startPos + -1 * 3];

        if (backgroundColor) {
          let backgroundOffset = 0;
          canvasContext.save();
          canvasContext.fillStyle = backgroundColor;
          if (isHorizontal.value) {
            canvasContext.fillRect(startX + offset[0] + backgroundOffset, 0, textSize, barSize);
          } else {
            canvasContext.translate(0, startY + offset[1]);
            canvasContext.rotate(-Math.PI / 2);
            canvasContext.fillRect(backgroundOffset, 0, textSize, barSize);
          }
          canvasContext.restore();
        }

        canvasContext.save();
        canvasContext.fillStyle = color;
        if (isHorizontal.value) {
          canvasContext.fillText(text, startX + offset[0], startY + offset[1]);
        } else {
          canvasContext.translate(startX + offset[0], startY + offset[1]);
          canvasContext.rotate(-Math.PI / 2);
          canvasContext.fillText(text, 0, 0);
        }
        canvasContext.restore();
      });

      canvasContext.restore();
    }

    function _onResize() {
      resize();
    }

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

    useResizeObserver(canvasRef, _onResize);

    watch(() => props.zoom, value => draw({ zoom: value }));

    tryOnMounted(() => {
      canvasContext = canvasRef.value?.getContext('2d', { alpha: true })!;
    });

    return () => (
      <canvas ref={canvasRef} />
    );
  },
});
