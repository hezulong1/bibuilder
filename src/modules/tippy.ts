import type { UserModule } from '../types';
import VueTippy, { roundArrow, setDefaultProps } from 'vue-tippy';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale-subtle.css';
// import 'tippy.js/dist/border.css';
import 'tippy.js/dist/svg-arrow.css';

export default <UserModule>{
  onAppInit(app) {
    app.use(VueTippy);

    setDefaultProps({
      animation: 'scale-subtle',
      appendTo: document.body,
      allowHTML: false,
      animateFill: false,
      arrow: roundArrow, // + roundArrow,
      popperOptions: {
        // https://popper.js.org/docs/v2/utils/detect-overflow/
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'document',
            },
          },
        ],
      },
    });
  },
};
