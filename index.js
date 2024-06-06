const { importAddress } = require('./cmd/importAddress');
const { viewJigs } = require('./cmd/view');
const { convertItem } = require('./cmd/convert');
const { importFromSeed, getIdentityAddress } = require('./cmd/import');
const { program } = require('commander');

// Get the default identity address from the mnemonic
const defaultAddress = process.env.MNEMONIC ? getIdentityAddress(process.env.MNEMONIC).to_string() : undefined;

program
  .command('import')
  .description('Import from mnemonic in .env')
  .option('-a, --address <address>', 'Specify the address', defaultAddress)
  .action((options) => {
    importFromSeed(options.address).catch(console.error)
      .then(() => process.exit(0));
  });

program
  .command('view')
  .description('View the imported jigs. Optional page number will use 25 jigs per page.')
  .option('-a, --address <address>', 'Specify the address', defaultAddress)
  .option('-p, --page <page>', 'Specify the page', undefined)
  .option('-s, --search <term>', 'Search jigs by name')
  .action((options) => {
    viewJigs(options.address, options.page, options.search)
      .catch(console.error)
      .then(() => process.exit(0));
  });

program
  .command('convert <id>')
  .description('Convert the jig by its ID number (visible with view command)')
  .option('-a, --address <address>', 'Specify the address', defaultAddress)
  .option('-d, --destination <destination>', 'Specify the destination', defaultAddress)
  .action((id, options) => {
    convertItem(id, options.address, options.destination)
      .catch(console.error)
      .then(() => process.exit(0));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

// const { importAddress } = require('./cmd/importAddress')
// const { viewJigs } = require('./cmd/view')
// const { convertItem } = require('./cmd/convert')
// const { importFromSeed } = require('./cmd/import')
// const { program } = require('commander');

// program.option('-i, --import', 'Import from mnemonic in .env')
//   .option('-a, --address <address>', 'Specify the address')
//   .option('-v, --view [page]', 'View the imported jigs. Optional page number will use 25 jigs per page.')
//   .option('-c, --convert <id>', 'Convert the jig by its ID number (visible with -v)')
//   .parse(process.argv);

// const options = program.opts();

// if (options.import) {
//   importFromSeed().catch(console.error)
//   .then(() => process.exit(0))
//   return
// }

// if (!options.address && !options.view && !options.convert) {
//   console.error('Error: Address is required.');
//   program.help();
// }

// if (options.address && !options.convert && !options.view) {
//   importAddress(options.address)
//     .catch(console.error)
//   .then(() => process.exit(0));
// }

// if (options.view) {
//   viewJigs(options.address, options.view)
//     .catch(console.error)
//     .then(() => process.exit(0))
// }

// if (options.convert) {
//   convertItem(options.convert, options.address)
//     .catch(console.error)
//     .then(() => process.exit(0))
// }
