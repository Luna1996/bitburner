import { hexToRgb, printHTML, rgbToGray } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const theme = ns.ui.getTheme();
  const L = 50;
  let html = '';
  for (const name in theme) {
    const bg = theme[name];
    const fg = rgbToGray(hexToRgb(bg)) >= 128 ? '#000' : '#fff';
    html += `<span style='color:${fg};background-color:${bg};'>`;
    html += `<span style='user-select:text;'>${name}</span> `;
    html += `<span style='user-select:text;'>${bg}</span>${' '.repeat(L - name.length - bg.length - 1)}`
    html += `</span>\n`;
  }
  printHTML(`<span style='line-height:1.2;margin:0;user-select:none;'>${html}</p>`);
}
