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

1. Clone this repo:

```bash
git clone https://github.com/shruggr/1sat-run-import.git
```

2. Install dependencies:

```bash
npm i
```

3. Install the `runto1sat` command globally (optional)

```bash
npm i -g .
```

If you don't want to install the `runto1sat` command globally, you can run the tool directly from the project folder:

```bash
npm run start -h
```

# Usage

1. Import your run token data
```bash
runto1sat import
```

2. View imported token details
```bash
runto1sat view
```

3. Migrate a token
```bash
runto1sat migrate <id>
```

# Run the help menu for a list of commands:

```bash
runto1sat start -h
```

# Roadmap

- [x] Import token data from utxos
- [x] View imported token details
- [ ] Import live orderlock (a.k.a. Run lock)
- [ ] Cancel open Run lock orders
- [ ] Mint new 1Sat Ordinals (spends Run tokens)

