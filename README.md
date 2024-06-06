## runto1sat

CLI tool for migrating Run tokens to 1Sat Ordinals.

# Features

- Download Run token data for your RelayX seed phrase
- View / search your tokens
- Mint new 1Sat Ordinals (spends Run tokens)

# Requirements

This tool requires [redis is installed](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) and available on port 6379 (default redis port). Redis is used to cache token data.

NOTE: The `run-sdk` is deprecated and requires node v16 or lower.

If you don't have nvm already, [install it](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script). Install v16, hen run `nvm use` in the project folder to use the version specified by .nvmrc.

# Environment Variables

Rename the `.env.example` to `.env` and fill in your RelayX mnemonic and 1Sat Ordinals destination address where you would like to send tokens after migrating.

- `MNEMONIC` - Your RelayX mnemonic
- `DESTINATION_ORD_ADDRESS` - Your 1Sat Ordinals address

# Install

Clone this repo into a folder of your choice, and follow the steps below from a terminal in that directory.

1. Install dependencies
`npm i`

2. Install the "runto1sat" command globally
`npm i -g .`

3. import your run token data
`runto1sat import`

4. View imported token details
`runto1sat view`

# Run the help menu for a list of commands:

`runto1sat start -h`

# Roadmap

- [x] Import token data from utxos
- [x] View imported token details
- [ ] Import live orderlock (a.k.a. Run lock)
- [ ] Cancel open Run lock orders
- [ ] Mint new 1Sat Ordinals (spends Run tokens)

