import type { UserModule } from '../types';
import { createHead } from '@unhead/vue';

export default <UserModule>{
  onAppInit(app) {
    app.use(createHead());
  },
};
