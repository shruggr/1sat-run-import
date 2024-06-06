const { ExtendedPrivateKey, P2PKHAddress } = require("bsv-wasm")
const { importAddress } = require('./importAddress');
const { DEFAULT_WALLET_PATH, DEFAULT_ORD_PATH, DEFAULT_RELAYX_ORD_PATH } = require('../constants');

async function importFromSeed() {

  // make sure end is set
  if (!process.env.mnemonic) {
    throw new Error('Error: Mnemonic is required.');
  }

  const mnemonic = process.env.mnemonic
  const seedStr = mnemonic.trim()

  const xprivWasm = ExtendedPrivateKey.from_mnemonic(
    Buffer.from(seedStr, "utf8")
  );
  const relayMnemonicPrivKey = xprivWasm.derive_from_path(DEFAULT_RELAYX_ORD_PATH);
  const privateKey = relayMnemonicPrivKey.get_private_key();
  const identityAddress = P2PKHAddress.from_pubkey(privateKey.to_public_key());

  const ordMnemonicPrivKey = xprivWasm.derive_from_path(DEFAULT_ORD_PATH);
  const ordPrivateKey = ordMnemonicPrivKey.get_private_key();
  const ordAddress = P2PKHAddress.from_pubkey(ordPrivateKey.to_public_key());

  const walletMnemonicPrivKey = xprivWasm.derive_from_path(DEFAULT_WALLET_PATH);
  const walletPrivateKey = walletMnemonicPrivKey.get_private_key();
  const walletAddress = P2PKHAddress.from_pubkey(walletPrivateKey.to_public_key());
  const walletWif = walletPrivateKey.to_wif();
  console.log({ identity_address: identityAddress.to_string(), ord_address: ordAddress.to_string(), wallet_address: walletAddress.to_string()});
  await importAddress(identityAddress.to_string())
  // await importAddress(ordAddress.to_string())
  // await importAddress(walletAddress.to_string())
}

module.exports = { importFromSeed }
