import { nextTick } from 'vue';
import type { BiModule } from '.';

export default <BiModule>{
  onAppInit(app) {
    app.directive('focus', {
      mounted: el => nextTick(() => el.focus()),
    });
  },
};
