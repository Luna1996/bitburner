/** @param {import('./tool').NS} ns */
export async function main(ns) {
  console.log(ns.ui.getTheme())
  ns.alert(`<p style="line-height:1">${'│fu<span style="color:green">c</span>k\n'.repeat(10)}</p>`);
}
