import { USE_MOCKS } from '../../util/Config.js';
import AJAX from './ajax/Ajax.js';
import MockAJAX from './mock/MockAjax.js';

export const ApiClient = USE_MOCKS ? MockAJAX : AJAX;
