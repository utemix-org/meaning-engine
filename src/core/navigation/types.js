/**
 * Navigation types.
 *
 * Runtime constants and factory functions for navigation transitions.
 */

export const TransitionType = {
  SELECT: 'select',
  DRILL_DOWN: 'drillDown',
  DRILL_UP: 'drillUp',
  RESET: 'reset',
};

/** @param {string} nodeId */
export function select(nodeId) {
  return { type: TransitionType.SELECT, nodeId };
}

/** @param {string} nodeId */
export function drillDown(nodeId) {
  return { type: TransitionType.DRILL_DOWN, nodeId };
}

export function drillUp() {
  return { type: TransitionType.DRILL_UP };
}

export function reset() {
  return { type: TransitionType.RESET };
}
