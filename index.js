const { importAddress } = require('./cmd/importAddress')
const { viewJigs } = require('./cmd/view')
const { convertItem } = require('./cmd/convert')
const { importFromSeed } = require('./cmd/import')
const { program } = require('commander');

program.option('-i, --import', 'Import from mnemonic in .env')
  .option('-a, --address <address>', 'Specify the address')
  .option('-v, --view [page]', 'View the imported jigs. Optional page number will use 25 jigs per page.')
  .option('-c, --convert <id>', 'Convert the jig by its ID number (visible with -v)')
  .parse(process.argv);

const options = program.opts();

if (options.import) {
  importFromSeed().catch(console.error)
  .then(() => process.exit(0))
  return
}

if (!options.address && !options.view && !options.convert) {
  console.error('Error: Address is required.');
  program.help();
}

if (options.address) {
  importAddress(options.address)
    .catch(console.error)
  .then(() => process.exit(0));
}

if (options.view) {
  viewJigs(options.view)
    .catch(console.error)
    .then(() => process.exit(0))
}

if (options.convert) {
  convertItem(options.convert)
    .catch(console.error)
    .then(() => process.exit(0))
}
