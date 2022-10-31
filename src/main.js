import { exec, setEnablePrint } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  setEnablePrint(false);
  exec('alias theme="run theme.js"');
  exec('alias tree="run tree.js"');
  exec('alias goto="run goto.js"');
  exec('alias test="run test.js"');
  setEnablePrint(true);
}