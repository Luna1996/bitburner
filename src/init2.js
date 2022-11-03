import { execRaw, updateTree } from './tool';

/** @type {Tree} */
extra.tree;
/** @type {Object.<string, {}>} */
extra.hacked;
/** @type {number} */
extra.totalSvrRam;
/** @type {(Script|ScriptGroup)[]} */
extra.scripts;

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  extra.tree = null;
  extra.hacked = {};
  extra.totalSvrRam = 0;
  extra.scripts = [];
  updateTree(ns);
  ns.atExit(() => execRaw('home;run init3.js;'));
}