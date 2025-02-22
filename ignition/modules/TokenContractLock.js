// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenContractLock", (m) => {
    const initialSupply = m.getParameter("initialSupply", 1000000);
    const myToken = m.contract("TokenContract", [initialSupply]);

    return { myToken };
});
