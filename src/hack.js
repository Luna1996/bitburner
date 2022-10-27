/** @param {import('./tool').NS} ns */
export async function main(ns) {
  window.hack = 0;
  ns.alert(`<p id='hack' onclick='const item = document.getElementById("hack");hack += 1;item.innerHTML = "FUCK" + hack;'>FUCK0</p>`);
}
