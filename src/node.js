/** @param {import('./tool').NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  const hn = ns.hacknet;
  loop:
  while (true) {
    let money = ns.getServerMoneyAvailable('home');
    let num_node = hn.numNodes();
    if (money >= hn.getPurchaseNodeCost()) {
      ns.hacknet.purchaseNode();
      ns.print(`node${num_node}: new`);
      continue;
    }
    for (let i = 0; i < num_node; i++) {
      if (money >= hn.getLevelUpgradeCost(i, 1)) {
        hn.upgradeLevel(i, 1);
        ns.print(`node${i}: level`);
        continue loop;
      }
      if (money >= hn.getRamUpgradeCost(i, 1)) {
        hn.upgradeRam(i, 1);
        ns.print(`node${i}: ram`);
        continue loop;
      }
      if (money >= hn.getCoreUpgradeCost(i, 1)) {
        hn.upgradeCore(i, 1);
        ns.print(`node${i}: core`);
        continue loop;
      }
    }
    await ns.sleep(1000);
  }
}