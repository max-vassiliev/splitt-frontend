'use strict';

import { initializeLegacyScript } from './legacy-script.js';

function init() {
  console.log('Initializing refactored app...');

  initializeLegacyScript();
}
init();
