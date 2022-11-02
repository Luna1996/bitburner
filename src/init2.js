import { style, theme } from './init1';
import { execRaw, printHTML, updateTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  extra.tree = null;
  extra.hacked = { 'home': {} };
  extra.scripts = [];

  updateTree(ns);
  ns.atExit(() => execRaw('home;run init3.js;'));
}