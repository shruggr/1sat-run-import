## Run to 1Sat Token Importer

Import Run token data from your RelayX seed phrase and mint new 1Sat Ordinals (spends Run tokens).

# Prerequisites

This tool requires [redis is installed](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) and available on port 6379 (default redis port). Redis is used to cache token data.

NOTE: The `run-sdk` is deprecated and requires node v16 or lower.

If you don't have nvm already, (install it)[https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script]. Install v16, hen run `nvm use` in the project folder to use the version specified by .nvmrc.

# Install

`bun i`

`bun run start -a "18bSDTn4wxTVwMyNpthTEyfwW7afeeiWbN"`

# Roadmap

- [x] Import token data from utxos
- [x] View imported token details
- [ ] Import live orderlock (a.k.a. Run lock)
- [ ] Cancel open Run lock orders
- [ ] Mint new 1Sat Ordinals (spends Run tokens)

