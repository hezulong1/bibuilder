export const Ruler3 = defineComponent({
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
    const rulerRef = ref<HTMLElement>();
    const isVerticalRef = computed(() => props.orientation === 'vertical');

    const widthRef = ref(0);
    const heightRef = ref(0);
    const maximumValue = computed(() => isVerticalRef.value ? heightRef.value : widthRef.value);
    const intervalValue = computed(() => {
      const zoom = props.zoom;
      if (typeof zoom === 'undefined') return 50;
      if (zoom > 1.5) return 25;
      else if (zoom > 0.75 && zoom <= 1.5) return 50;
      else if (zoom > 0.4 && zoom <= 0.75) return 100;
      else if (zoom > 0.2 && zoom <= 0.4) return 200;
      else return 400;
    });

    tryOnMounted(() => {
      if (props.width) {
        widthRef.value = props.width === '100%' ? (rulerRef.value?.offsetWidth ?? 0) : props.width;
      }

      if (props.height) {
        heightRef.value = props.height === '100%' ? (rulerRef.value?.offsetHeight ?? 0) : props.height;
      }

      if (Number.isNaN(widthRef.value)) {
        __DEV__ && console.warn('`widthRef.value` is `NaN`.');
        widthRef.value = 0;
      }
      if (Number.isNaN(heightRef.value)) {
        __DEV__ && console.warn('`heightRef.value` is `NaN`.');
        heightRef.value = 0;
      }
    });

    const tickList: number[] = [];

    function draw() {
      let max = maximumValue.value;
      let each = intervalValue.value;

      let value = props.start || 0;
      let interval = Math.floor(value / each) * each;

      while (value < max) {

      }
    }

    ctx.expose({
      draw,
    });

    watch(() => [widthRef, heightRef], draw);

    return () => (
      <svg ref={rulerRef} class="ui-Ruler block size-full">
        <g />
      </svg>
    );
  },
});
