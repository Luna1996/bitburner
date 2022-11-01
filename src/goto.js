import { getTree, cnct } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  cnct(getTree(ns), ns.args[0])
}