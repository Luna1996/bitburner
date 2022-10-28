import { getTree, goto } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  goto(getTree(ns), ns.args[0])
}