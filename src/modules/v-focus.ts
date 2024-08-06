import type { UserModule } from '../types';
import { nextTick } from 'vue';

export default <UserModule>{
  onAppInit(app) {
    app.directive('focus', {
      mounted: el => nextTick(() => el.focus()),
    });
  },
};
