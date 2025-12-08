export const DEBUG = process.env.NODE_ENV === 'development' && process.env.DEBUG_MODELS === 'true';

export function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log(...args);
  }
}