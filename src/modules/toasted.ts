import type { ToastOptions } from '@hoppscotch/vue-toasted';
import type { UserModule } from '../types';

import Toasted from '@hoppscotch/vue-toasted';
import '@hoppscotch/vue-toasted/style.css';

export default <UserModule>{
  onAppInit(app) {
    app.use(Toasted, <ToastOptions>{
      position: 'bottom-center',
      duration: 3000,
      keepOnHover: true,
    });
  },
};
