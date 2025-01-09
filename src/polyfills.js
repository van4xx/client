import { Buffer } from 'buffer';

window.global = window;
window.process = {
  env: { DEBUG: undefined },
  version: '',
  nextTick: require('next-tick')
};
window.Buffer = Buffer; 