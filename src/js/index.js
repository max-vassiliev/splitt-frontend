'use strict';

import { initializeLegacyScript } from './legacy-script.js';
import mainController from './controller/MainController.js';

async function init() {
  try {
    initializeLegacyScript();
    await mainController.init();
  } catch (error) {
    console.error('💥💥💥💥💥');
    throw error;
  }
}
init();
