import { getTree, _cnct } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  _cnct(getTree(ns), ns.args[0])
}