const fs = require('fs')
// const { Tx, TxIn, TxOut, Script } = require('@ts-bitcoin/core')
const { getIdentityAddress } = require('./import')
const { buildInscription } = require('js-1sat-ord')
const { P2PKHAddress, Transaction, TxIn, TxOut, Script } = require ('bsv-wasm')

async function convertItem(itemNum, address, destination) {

  if (!address) {
    const mnemonic = process.env.MNEMONIC 
    address = getIdentityAddress(mnemonic).to_string()
  }

  if (!destination) {
    destination = address
  }

  const jigDetails = await getJigDetails(itemNum, address)
  
  // build a transaction
  const tx = new Transaction(1, 0)
  const tokenTxid = jigDetails.location.split("_")[0]
  const txOutNum = parseInt(jigDetails.location.split("_")[1].replace("o",""))
  
  // Get the raw script from this particular run token
  const response = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/${tokenTxid}`)
  const data = await response.json()
  const script = Script.from_hex(data.vout[txOutNum].scriptPubKey.hex)
  const input = new TxIn(Buffer.from(tokenTxid, 'hex'), txOutNum, script)
  tx.add_input(input)
  const destinationAddress = P2PKHAddress.from_string(destination)

  const origin = jigDetails.constructor.origin
  const metadata = jigDetails.constructor.metadata
  if (origin && metadata) {
    console.log("Extras", origin, metadata)
    const originTxid = origin.split("_")[0]
    const audioSuffix = metadata.audio // _o2
    const imageSuffix = metadata.image // _o1

    const mediaType = "text/uri-list"
    const fileContent = `${originTxid}_${imageSuffix}
${originTxid}_${audioSuffix}
`
    const b64File = Buffer.from(fileContent).toString('base64')
    const outputScript = buildInscription(destinationAddress, b64File, mediaType)
    // const outputScript = new Script.fromAsmString
    
    const satsOut = BigInt(jigDetails.satoshis || "1");
    const output = new TxOut(satsOut, outputScript)
    tx.add_output(output)
  }

  console.log({deets: jigDetails.constructor, tx: tx.to_hex()})
  // create a new 1sat inscription

  // sign it

  //send it
}

const getJigDetails = async (itemNum, address) => {
  const jigs = fs.readdirSync(`./jigs/${address}`)
  console.log(jigs[itemNum])
  const data = fs.readFileSync(`./jigs/${address}/${jigs[itemNum]}`)
  return JSON.parse(data)
}

module.exports = { convertItem, getJigDetails }

