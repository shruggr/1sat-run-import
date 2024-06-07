const fs = require('fs')
const pc = require("picocolors")
const { getIdentityAddress } = require("./import")
const homeDir = require('os').homedir()

async function viewJigs(address, page, searchTerm) {
  console.log("Viewing jigs for", address, "searching for", searchTerm)

  if (!address || address === "") {
    const mnemonic = process.env.RELAYX_MNEMONIC
    address = getIdentityAddress(mnemonic).to_string()
  }
  // first read the folder
  let jigs = fs.readdirSync(`${homeDir}/runto1sat/jigs/${address}`)

  if (searchTerm) {
    jigs = jigs.filter((jig) => {
      const jigDetails = JSON.parse(fs.readFileSync(`${homeDir}/runto1sat/jigs/${address}/${jig}`, 'utf8'));
      const name = jigDetails.constructor.metadata?.name || "";
      const desc = jigDetails.constructor.metadata?.description || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase()) || desc.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }


  // iterate over the jigs and print the details
  let i = 0;

  if (page) {
   jigs = jigs.slice((page - 1) * 25, page * 25)
  }

  for (const jig of jigs) {
    const jigDetails = JSON.parse(fs.readFileSync(`${homeDir}/runto1sat/jigs/${address}/${jig}`, 'utf8'))
    const num = `[${(page ? page - 1 : 0) * 25 + i++}]`
    const name = jigDetails.constructor.metadata?.name || "No name"
    const desc = jigDetails.constructor.metadata?.description || "No description"
    console.log(pc.bgWhite(num), pc.green(name), pc.gray(desc.replaceAll("\n", "")))
  }
}

module.exports = { viewJigs }