export const Ruler3 = defineComponent({
  name: 'Ruler3',
  props: {
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'horizontal',
    },

    zoom: Number,

    start: {
      type: Number,
      default: 0,
    },

    width: [Number, String] as PropType<number | '100%'>,
    height: [Number, String] as PropType<number | '100%'>,

    textColor: String,
    tickColor: String,
  },
  setup(props, ctx) {
    const rulerRef = ref<SVGElement>();
    const isVerticalRef = computed(() => props.orientation === 'vertical');

    const widthRef = ref(0);
    const heightRef = ref(0);
    const ticksRef = ref<number[]>([]);
    const maximumSize = computed(() => isVerticalRef.value ? heightRef.value : widthRef.value);
    const intervalSize = computed(() => {
      const zoom = props.zoom;
      if (typeof zoom === 'undefined') return 50;
      if (zoom > 1.5) return 20;
      else if (zoom > 0.75 && zoom <= 1.5) return 50;
      else if (zoom > 0.4 && zoom <= 0.75) return 100;
      else if (zoom > 0.2 && zoom <= 0.4) return 200;
      else return 400;
    });

    tryOnMounted(() => {
      draw();
    });

    function onResize() {
      if (props.width) {
        widthRef.value = props.width === '100%' ? (rulerRef.value?.clientWidth ?? 0) : props.width;
        rulerRef.value?.style.setProperty('width', `${widthRef.value}px`);
      }

      if (props.height) {
        heightRef.value = props.height === '100%' ? (rulerRef.value?.clientHeight ?? 0) : props.height;
        rulerRef.value?.style.setProperty('height', `${heightRef.value}px`);
      }

      if (Number.isNaN(widthRef.value)) {
        __DEV__ && console.warn('`widthRef.value` is `NaN`.');
        widthRef.value = 0;
      }
      if (Number.isNaN(heightRef.value)) {
        __DEV__ && console.warn('`heightRef.value` is `NaN`.');
        heightRef.value = 0;
      }
    }

    function draw() {
      onResize();

      const tickList: number[] = [];

      let originMaximum = maximumSize.value;
      let originInterval = intervalSize.value;

      let curTick = Math.floor((props.start || 0) / originInterval) * originInterval;
      let eachTick = Math.floor(originInterval / 10);
      let maxTick = Math.ceil(originMaximum / originInterval) * originInterval;

      while (curTick <= maxTick) {
        tickList.push(curTick);
        curTick += eachTick;
      }

      ticksRef.value = tickList;
    }

    ctx.expose({
      draw,
    });

    watch(() => [props.width, props.height], draw);

    return () => (
      <svg ref={rulerRef} class="ui-Ruler block size-full">
        <g>
          {ticksRef.value.map((pos, i) => {
            let x1 = 0.5, y1 = 0.5;
            let x2 = 0.5, y2 = 0.5;

            const isPrimary = i % 10 === 0;
            const isCenter = i % 5 === 0;
            const percent = isPrimary ? 0.8 : isCenter ? 0.5 : 0.35;
            const realValue = pos + 0.5;

            if (isVerticalRef.value) {
              y1 = y2 = realValue;
              x2 = percent * 100 * widthRef.value / 100;
            } else {
              x1 = x2 = realValue;
              y2 = percent * 100 * heightRef.value / 100;
            }

            const vnodes = [<line key={`line-${i}`} x1={x1} x2={x2} y1={y1} y2={y2} stroke={props.tickColor} stroke-width={1} />];

            if (isPrimary) {
              let x = isVerticalRef.value ? x2 : (x2 + 4);
              let y = isVerticalRef.value ? (y2 + 4) : y2;
              let trans = isVerticalRef.value ? `rotate(-90, ${x - 4}, ${y - 4})` : undefined;
              vnodes.push(
                <text
                  key={`text-${i}`}
                  x={x}
                  y={y}
                  fill={props.textColor}
                  font-size={11}
                  font-family="-apple-system, 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei', sans-serif"
                  transform={trans}
                >
                  {i * intervalSize.value / 10}
                </text>,
              );
            }

            return vnodes;
          })}
        </g>
      </svg>
    );
  },
});
