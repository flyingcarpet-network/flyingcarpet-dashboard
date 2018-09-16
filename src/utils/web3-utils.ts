/*
 * This file contains functions that aid in assessing the state of the web3 connection.
 */

import Geohash from 'latlon-geohash';
const EIP20JSON = require('./../contracts/abi/EIP20.json');
const RegistryJSON = require('./../contracts/abi/Registry.json');
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

/*
 * @dev getBounties           Resolves an array of objects, each containing a the bounty data object,
 *                            including a coordinates (lat/lon) field.
 *                            (e.g.: [{title: "...", location: {lat: "...", lon: "..."}, ...}, ...] )
 * @param web3                Web from Web3Provider injected by Ethereum-enabled browser.
 */
export function getBounties(web3) {
  return new Promise((resolve, reject) => {
    const registryContractAddress = contractAddresses.Registry;
    const registryContract = new web3.eth.Contract(RegistryJSON.abi, registryContractAddress);

    // Get the total number of bounties
    return registryContract.methods.getNumBounties().call().then(numListings => {
      const bountyData: any[] = []; // Bounty return array
      if (numListings === 0) { return []; }

      // Recursively iterate over listings (asynchronously)
      return (function nextBounty (i) {
        // Get bounty `data` field from listing
        registryContract.methods.getBountyData(i - 1).call().then((dataString: string) => {
          const dataObj: any = JSON.parse(dataString);

          // Push bounty to return array
          bountyData.push({
            ...dataObj.payload,
            coordinates: Geohash.decode(dataObj.payload.geohash)
          });
          if (--i) { return nextBounty(i); } // Decrement i and call nextBounty again if i > 0
          else { return resolve(bountyData); } // Last iteration
        });
      })(numListings);
    }).catch(reject);
  });
}

/*
 * @dev issueBounty           Submits a bounty for the provided form values.
 * @param web3                Web from Web3Provider injected by Ethereum-enabled browser.
 * @param formValues          A data object used to create the bounty. This data must obey the
 *                            schema detailed here: https://github.com/flyingcarpet-network/Flyingcarpet-TCR/tree/feature/Update-README-for-TCRO#registry-contract-functions
 */
export function submitBounty(web3, formValues) {
  return new Promise((resolve, reject) => {
    const registryContractAddress = contractAddresses.Registry;
    const registryContract = new web3.eth.Contract(RegistryJSON.abi, registryContractAddress);

    const erc20ContractAddress = contractAddresses.Nitrogen;

    const { geohash, dataCollectionRadius, useType, collectionType, droneType, resolution, fileFormat } = formValues;

    // TODO: Add extensive data validation of form values.

    const bountyObject = {
      "payload": {
        "title":  "Data collection using a " + capitalize(collectionType) + " for " + capitalize(useType) + " @  " + geohash + " (geohash)",
        "description": "This is a request for aerial land data collection using a satellite. ...",
        "issuer": [
          {"address": registryContractAddress}
        ],
        "funders":[],
        "categories": ["Data Collection", capitalize(collectionType), capitalize(useType)],
        "created": 1536957876,
        "tokenSymbol": "NTN",
        "tokenAddress": erc20ContractAddress,
        "geohash": geohash,
        "useType": useType,
        "collectionType": collectionType,
        "radiusOfCollection": dataCollectionRadius,
        "resolution": resolution,
        "fileFormat": fileFormat,
        "droneType": droneType
      }
    };
    const bountyDataString = JSON.stringify(bountyObject);

    // Get the default (active) MetaMask account address
    return getDefaultAccount(web3).then((accountAddr: any) => {
      // Get current gas price
      return web3.eth.getGasPrice().then((price: number) => {
        // Submit new bounty 
        return registryContract.methods.submit(bountyDataString).send({ from: accountAddr, gasPrice: price, gas: 100000 }).then(resolve).catch(reject);
      }).catch(reject);
    }).catch(reject);
  });
}

/*
 * @dev capitalize           Simple helper function to capitalize the first letter of a string.
 * @param str                Any string to be capitalized.
 */
function capitalize(str: string) {
  if (!str || str.length === 0) { return ''; }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
