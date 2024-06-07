#!/usr/bin/env node
const { importAddress } = require('./cmd/importAddress');
const { viewJigs } = require('./cmd/view');
const { migrateItem } = require('./cmd/migrate');
const { importFromSeed, getIdentityAddress } = require('./cmd/import');
const { program } = require('commander');
const { openExplorer } = require('explorer-opener');
const fs = require('fs');
const path = require('path');
const userHome = require('os').homedir();

// Get the default identity address from the mnemonic
const defaultAddress = process.env.RELAYX_MNEMONIC ? getIdentityAddress(process.env.RELAYX_MNEMONIC).to_string() : undefined;
const defaultDestinationAddress = process.env.DESTINATION_ORD_ADDRESS ? process.env.DESTINATION_ORD_ADDRESS : undefined;

program.name("runto1sat")

program
  .command('import')
  .alias('i')
  .description('Import Run jigs from RelayX mnemonic (uses .env RELAYX_MNEMONIC)')
  .option('-a, --address <address>', 'Specify the address', defaultAddress)
  .action((options) => {
    importFromSeed(options.address).catch(console.error)
      .then(() => process.exit(0));
  });

program
  .command('view')
  .alias('v')
  .description('View imported Run jigs.')
  .option('-a, --address <address>', 'Specify the address', defaultAddress)
  .option('-p, --page <page>', 'Specify the page, omit for all. 25 jigs per page.', undefined)
  .option('-f, --find <term>', 'Find jigs by name')
  .action((options) => {
    viewJigs(options.address, options.page, options.find)
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
            // check if it exists
            if (!fs.existsSync(path.join(userHome, 'runto1sat', 'jigs'))) {
              console.log('Nothing to open. Use the import command to populate files.')
              process.exit(0)
            }
      openExplorer(path.join(userHome, 'runto1sat', 'jigs'))
    })

    // command to clear the cache
    program.command('clear')
    .alias('c')
    .description('Clears the jig cache')
    .action(() => {
      if (!fs.existsSync(path.join(userHome, 'runto1sat', 'jigs'))) {
        console.log('Nothing to clear')
        process.exit(0)
      }
      fs.rmSync(path.join(userHome, 'runto1sat', 'jigs'), { recursive: true }).then(() => {
        console.log('Jig cache cleared')
        process.exit(0)
      }).catch((e) => {
        console.error(e.message)
        process.exit(1)
      })
    })

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}