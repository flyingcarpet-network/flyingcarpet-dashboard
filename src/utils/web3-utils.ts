/*
 * This file contains functions that aid in assessing the state of the web3 connection.
 */

const EIP20JSON = require('./../contracts/abi/EIP20.json');
const addresses = require('./../contracts/addresses.json');
const contractAddresses = addresses.contracts;

/*
 * @dev isAnyUnlockedAccount  Resolves if provider has at least one unlocked account. Rejects otherwise.
 * @param web3                Web from Web3Provider injected by Ethereum-enabled browser.
 */
export function isAnyUnlockedAccount(web3) {
  return new Promise((resolve, reject) => {
    return web3.eth.getAccounts().then(accounts => {
      if (accounts.length >= 1) { resolve(); }
      else { reject(); }
    }).catch(reject);
  });
}

/*
 * @dev getDefaultAccount     Resolves the address of the current default account from provider.
 * @param web3                Web from Web3Provider injected by Ethereum-enabled browser.
 */
export function getDefaultAccount(web3) {
  return new Promise((resolve, reject) => {
    return web3.eth.getAccounts().then(accounts => {
      if (accounts.length < 1) { reject(); }
      resolve(accounts[0]);
    }).catch(reject);
  });
}

/*
 * @dev getNetworkName        Resolves the name of the current network the provider is connected to (e.g. Rinkeby, etc.).
 * @param web3                Web from Web3Provider injected by Ethereum-enabled browser.
 */
export function getNetworkName(web3) {
  return new Promise((resolve, reject) => {
    return web3.eth.net.getNetworkType().then(resolve).catch(reject);
  });
}

/*
 * @dev getNitrogenBalance    Resolves the balance of NTN tokens for the provided account address.
 * @param web3                Web from Web3Provider injected by Ethereum-enabled browser.
 * @param address             Address of the account to return the balance of NTN tokens of.
 */
export function getNitrogenBalance(web3, address) {
  return new Promise((resolve, reject) => {
    const erc20ContractAddress = contractAddresses.Nitrogen;
    const erc20Contract = new web3.eth.Contract(EIP20JSON.abi, erc20ContractAddress);

    return erc20Contract.methods.balanceOf(address).call().then(resolve).catch(reject);
  });
}
