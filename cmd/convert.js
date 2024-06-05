const fs = require('fs')
const { Tx, TxIn, Script } = require('@ts-bitcoin/core')

async function convertItem(itemNum) {

  const jigDetails = await getJigDetails(itemNum)
  
  // build a transaction
  const tx = new Tx()
  const tokenTxid = jigDetails.location.split("_")[0]
  const txOutNum = jigDetails.location.split("_")[1].replace("o","")
  // TODO: get the script from the run token
  const script = new Script([])
  const input = TxIn.fromProperties(Buffer.from(tokenTxid, 'hex'), txOutNum, script, 0xFFFFFFFF)
  tx.addTxIn(input)
  
  console.log(jigDetails, tx.toHex())
  // create a new 1sat inscription

  // sign it

  //send it
}

const getJigDetails = async (itemNum) => {
  const jigs = fs.readdirSync('./jigs')
  console.log(jigs[itemNum])
  const data = fs.readFileSync(`./jigs/${jigs[itemNum]}`)
  return JSON.parse(data)
}

module.exports = { convertItem, getJigDetails }

