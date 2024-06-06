const fs = require('fs')
// const { Tx, TxIn, TxOut, Script } = require('@ts-bitcoin/core')
const { getIdentityAddress } = require('./import')
const { buildInscription } = require('js-1sat-ord')
const { P2PKHAddress, Transaction, TxIn, TxOut, Script } = require ('bsv-wasm')
const { toSatoshi } = require('satoshi-bitcoin')
// export type MAP = {
//   app: string;
//   type: string;
//   [prop: string]: string | string[];
// };

async function convertItem(itemNum, address, destination) {

  const jigDetails = await getJigDetails(itemNum, address)
  
  // build a transaction
  const tx = new Transaction(1, 0)
  const tokenTxid = jigDetails.location.split("_")[0]
  const txOutNum = parseInt(jigDetails.location.split("_")[1].replace("o",""))
  
  // Get the raw data from this particular run token origin
  const response = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/${tokenTxid}`)
  const data = await response.json()
  console.log({res: data.vout[txOutNum]})
  const script = Script.from_hex(data.vout[txOutNum].scriptPubKey.hex)
  const satoshis = toSatoshi(data.vout[txOutNum].value)
  const input = new TxIn(Buffer.from(tokenTxid, 'hex'), txOutNum, script)
  tx.add_input(input)
  const destinationAddress = P2PKHAddress.from_string(destination)

  const origin = jigDetails.constructor.origin
  const metadata = jigDetails.constructor.metadata
  metadata.royalties = metadata.royalties.map((r) => {
    r.destination = { type: "address", destination: metadata.royalties.address }
    r.percentage = r.royalty
    delete r.royalty
    delete r.address
    return r
  })

  let meta = undefined
  console.log(jigDetails)
  if (origin && metadata) {
    const originTxid = origin.split("_")[0]
    const audioSuffix = metadata.audio.replace('o', '') // _o2
    const imageSuffix = metadata.image.replace('o', '') // _o1

    const mediaType = "text/uri-list"
    const fileContent = `b://${originTxid}${imageSuffix}
b://${originTxid}${audioSuffix}`
    const b64File = Buffer.from(fileContent).toString('base64')
   meta = {
      app: "Run-to-1Sat",
      type: "ord",
      name: metadata.name || "",
      description: metadata.description || "",
      royalties: JSON.stringify(metadata.royalties),
      run_origin: origin.replace('o', ''),
      run_image_origin: `${originTxid}${imageSuffix}`,
      run_audio_origin: `${originTxid}${audioSuffix}`,
      mintNumber: jigDetails.no.toString()
    }

    // TODO: Handle collections
    if (metadata.isCollection) {
      meta.subType = "collection"
    }

    const subTypeData = {
      mintNumber: jigDetails.no.toString(),
      rank: "",
      rarityLabel: "",
      attachments: [{
        name: "",
        description: "",
        "content-type": "",
        url: `b://${originTxid}${imageSuffix}`
      }]
    }

    console.log("Extras", destinationAddress.to_string(), b64File, origin.replace('o', ''), metadata, meta)

    const outputScript = buildInscription(destinationAddress, b64File, mediaType, meta)
    const satsOut = BigInt(1);
    const change = BigInt(satoshis) - satsOut
    const output = new TxOut(satsOut, outputScript)
    tx.add_output(output)
    // add change output
    const changeOutput = new TxOut(change, script)
    tx.add_output(changeOutput)
  }

  console.log({ meta, tx: tx.to_hex()})
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

