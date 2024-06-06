const fs = require('fs')
const pc = require("picocolors")

async function viewJigs(page) {
  console.log("Viewing jigs")
  // first read the folder
  let jigs = fs.readdirSync('jigs')

  // iterate over the jigs and print the details
  let i = 0;

  if (page) {
   jigs = jigs.slice((page - 1) * 25, page * 25)
  }

  for (const jig of jigs) {
    const jigDetails = JSON.parse(fs.readFileSync(`jigs/${jig}`, 'utf8'))
    const num = `[${(page ? page - 1 : 0) * 25 + i++}]`
    const name = jigDetails.constructor.metadata?.name || "No name"
    const desc = jigDetails.constructor.metadata?.description || "No description"
    console.log(pc.bgWhite(num), pc.green(name), pc.gray(desc.replaceAll("\n", "")))
  }
}

module.exports = { viewJigs }