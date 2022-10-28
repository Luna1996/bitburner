import { exec } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const a = { b: 1 };
  extra.printRaw(React.createElement('p', { onClick: () => { console.log(a.b); } }, 'fuck'));
}
