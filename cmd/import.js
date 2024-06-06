const { ExtendedPrivateKey, P2PKHAddress } = require("bsv-wasm")
const { importAddress } = require('./importAddress');
const { DEFAULT_WALLET_PATH, DEFAULT_ORD_PATH, DEFAULT_RELAYX_ORD_PATH } = require('../constants');

async function importFromSeed() {

  // make sure end is set
  if (!process.env.MNEMONIC) {
    throw new Error('Error: Mnemonic is required.');
  }

  const mnemonic = process.env.MNEMONIC
  const seedStr = mnemonic.trim()

  const xprivWasm = ExtendedPrivateKey.from_mnemonic(
    Buffer.from(seedStr, "utf8")
  );

  const identityAddress = getIdentityAddress(mnemonic)
  const ordAddress = getOrdAddress(mnemonic)
  const walletAddress = getWalletAddress(mnemonic)
  
  console.log({ identity_address: identityAddress.to_string(), ord_address: ordAddress.to_string(), wallet_address: walletAddress.to_string()});
  
  await importAddress(identityAddress.to_string())
  
  // await importAddress(ordAddress.to_string())
  // await importAddress(walletAddress.to_string())
  
  // const walletWif = walletPrivateKey.to_wif();
}

const getIdentityAddress = (mnemonic) => {
  const xprivWasm = ExtendedPrivateKey.from_mnemonic(
    Buffer.from(mnemonic, "utf8")
  );
  const ordMnemonicPrivKey = xprivWasm.derive_from_path(DEFAULT_RELAYX_ORD_PATH);
  const ordPrivateKey = ordMnemonicPrivKey.get_private_key();
  return P2PKHAddress.from_pubkey(ordPrivateKey.to_public_key());
}

const getOrdAddress = (mnemonic) => {
  const xprivWasm = ExtendedPrivateKey.from_mnemonic(
    Buffer.from(mnemonic, "utf8")
  );
  const ordMnemonicPrivKey = xprivWasm.derive_from_path(DEFAULT_ORD_PATH);
  const ordPrivateKey = ordMnemonicPrivKey.get_private_key();
  return P2PKHAddress.from_pubkey(ordPrivateKey.to_public_key());
}


const getWalletAddress = (mnemonic) => {
  const xprivWasm = ExtendedPrivateKey.from_mnemonic(
    Buffer.from(mnemonic, "utf8")
  );
  const walletMnemonicPrivKey = xprivWasm.derive_from_path(DEFAULT_WALLET_PATH);
  const walletPrivateKey = walletMnemonicPrivKey.get_private_key();
  return P2PKHAddress.from_pubkey(walletPrivateKey.to_public_key());
}

module.exports = { importFromSeed, getIdentityAddress, getOrdAddress, getWalletAddress }
