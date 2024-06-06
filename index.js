#!/usr/bin/env node
const { importAddress } = require('./cmd/importAddress');
const { viewJigs } = require('./cmd/view');
const { migrateItem } = require('./cmd/migrate');
const { importFromSeed, getIdentityAddress } = require('./cmd/import');
const { program } = require('commander');
const { openExplorer } = require('explorer-opener');

const path = require('path');
const userHome = require('os').homedir();

// Get the default identity address from the mnemonic
const defaultAddress = process.env.MNEMONIC ? getIdentityAddress(process.env.MNEMONIC).to_string() : undefined;
const defaultDestinationAddress = process.env.DESTINATION_ORD_ADDRESS ? process.env.DESTINATION_ORD_ADDRESS : undefined;

program.name("run-to-1sat")

program
  .command('import')
  .alias('i')
  .description('Import from mnemonic in .env')
  .option('-a, --address <address>', 'Specify the address', defaultAddress)
  .action((options) => {
    importFromSeed(options.address).catch(console.error)
      .then(() => process.exit(0));
  });

program
  .command('view')
  .alias('v')
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
  .command('migrate <id>')
  .alias('m')
  .description('Migrate the Run jig to 1Sat by its ID number (visible with view command)')
  .option('-a, --address <address>', 'Specify the address', defaultAddress)
  .option('-d, --destination <destination>', 'Specify the destination', defaultDestinationAddress || defaultAddress)
  .action((id, options) => {
    migrateItem(id, options.address, options.destination)
      .catch(console.error)
      .then(() => process.exit(0));
  });

  // command to open the jigs folder
  program.command('open')
    .alias('o')
    .description('Opens the jigs folder')
    .action(() => {
      openExplorer(path.join(userHome, 'runto1sat', 'jigs'))
    })
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}