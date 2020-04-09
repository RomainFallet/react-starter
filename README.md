# React starter

The purpose of this repository is to provide instructions to create
and configure a new [React](https://reactjs.org/) app from scratch
with appropriate linters, editor config, testing utilities,
continuous integration on Ubuntu, macOS and Windows.

On Windows, commands are meant to be executed on PowerShell.

## Table of contents

- [Quickstart](#quickstart)
- [Manual configuration](#manual-configuration)
  - [Init the project](#init-the-project)
  - [Install Cypress & testing utilities](#install-cypress--testing-utilities)
  - [Install Prettier code formatter](#install-prettier-code-formatter)
  - [Install ESLint code linter with StandardJS rules](#install-eslint-code-linter-with-standardjs-rules)
  - [Install StyleLint code linter with Standard rules](#install-stylelint-code-linter-with-standard-rules)
  - [Install MarkdownLint](#install-markdownLint)
  - [Install npm-check dependencies checker](#install-dependencies-checker)
  - [Configure .editorconfig](#configure-editorconfig)
  - [Configure CI with Git hooks](#configure-ci-with-git-hooks)
  - [Configure CI with GitHub Actions](#configure-ci-with-github-actions)
  - [Integrate formatters, linters & syntax to VSCode](#integrate-formatters-linters--syntax-to-vscode)
- [Usage](#usage)
  - [Launch app](#launch-app)
  - [Launch unit tests](#launch-unit-tests)
  - [Launch functional tests](#launch-functional-tests)
  - [Check coding style & Lint code for errors/bad practices](#check-coding-style--lint-code-for-errorsbad-practices)
  - [Format code automatically](#format-code-automatically)
  - [Audit & fix dependencies vulnerabilities](#audit--fix-dependencies-vulnerabilities)
  - [Check & upgrade outdated dependencies](#check--upgrade-outdated-dependencies)

## Quickstart

```bash
git clone https://github.com/RomainFallet/react-starter
```

## Manual configuration

### Init the project

[Back to top ↑](#table-of-contents)

Define npm prefix:

```bash
# Set NPM prefix
npm config set save-prefix='~'

# Create app
npm init react-app ./react-starter --use-npm

# Install others packages
npm install axios@~0.19.0
npm install --save-dev npm-run-all@~4.1.5
```

Replace caret (^) by tilde (~) in package.json versions, then re-install deps:

```bash
npm install
```

Create a new empty "./.env" file at the root of the project.

### Install Cypress & testing utilities

[Back to top ↑](#table-of-contents)

Install packages:

```bash
# Install Cypress
npm i -D cypress@~4.3.0 @testing-library/cypress@~6.0.0

# Install other tools
npm i -D axios-mock-adapter@~1.18.0  jest-axe@~3.4.0 identity-obj-proxy@~3.0.0
```

Add these scripts in "./package.json" file:

```json
  "scripts": {
    "test:all": "react-scripts test --watchAll=false",
    "cy:run": "cypress run",
    "cy:open": "cypress open"
  },
```

Create a new "./cypress.json" file:

```json
{}
```

Create new folders "./cypress/fixtures" and "./cypress/integration".

### Install Prettier code formatter

[Back to top ↑](#table-of-contents)

```bash
# Install Prettier with StandardJS config
npm i -D prettier@~2.0.0 prettier-config-standard@~1.0.0

# Install configs for ESLint integration
npm i -D eslint-plugin-prettier@~3.1.0 eslint-config-prettier@~6.10.0 eslint-config-prettier-standard@~3.0.0
```

Add these scripts to "./package.json" file:

```json
  "scripts": {
    "lint:json": "prettier --check \"./**/*.json\"",
    "format:json": "prettier --write \"./**/*.json\"",
    "lint:yml": "prettier --check \"./**/*.yml\"",
    "format:yml": "prettier --write \"./**/*.yml\"",
  },
```

### Install ESLint code linter with StandardJS rules

[Back to top ↑](#table-of-contents)

```bash
# Install StandardJS, Jest & Cypress plugins
npm i -D eslint-plugin-standard@~4.0.0 eslint-plugin-jest@~23.8.0 eslint-plugin-cypress@~2.10.0

# Install StandardJS config
npm i -D eslint-config-standard@~14.1.0
```

Edit the "eslintConfig" key from "./package.json" file:

```json
{
  "eslintConfig": {
    "extends": [
      "plugin:jest/all",
      "plugin:cypress/recommended",
      "react-app",
      "standard",
      "prettier-standard"
    ],
    "plugins": ["jest", "cypress"]
  }
}
```

Add these scripts to "./package.json" file:

```json
  "scripts": {
    "lint:js": "eslint \"./**/*.js\"",
    "format:js": "eslint --fix \"./**/*.js\"",
  },
```

### Install StyleLint code linter with Standard rules

[Back to top ↑](#table-of-contents)

```bash
npm i -D stylelint@~13.0.0 stylelint-config-standard@~19.0.0 stylelint-config-prettier@~8.0.0
```

Create a new "./.stylelintrc.json":

```bash
{
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"]
}
```

Add these scripts to "./package.json" file:

```json
  "scripts": {
    "lint:css": "prettier --check \"./**/*.css\" && stylelint \"./**/*.css\"",
    "format:css": "prettier --write \"./**/*.css\" && stylelint --fix \"./**/*.css\""
  },
```

### Install MarkdownLint

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev markdownlint@~0.19.0 markdownlint-cli@~0.22.0
```

Create a new "./.markdownlint.json" file:

```json
{
  "default": true
}
```

Add these scripts to "./package.json" file:

```json
  "scripts": {
    "lint:md": "markdownlint \"./**/*.md\" --ignore ./node_modules",
    "format:md": "markdownlint --fix \"./**/*.md\" --ignore ./node_modules",
    "lint": "npm-run-all lint:*",
    "format": "npm-run-all format:*"
  },
```

### Install dependencies checker

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev npm-check@~5.9.0
```

Add these scripts to "./package.json" file:

```json
  "scripts": {
    "deps:check": "npm-check",
    "deps:upgrade": "npm-check -u"
  },
```

### Configure .editorconfig

[Back to top ↑](#table-of-contents)

Create a new "./.editorconfig " file:

```bash
# EditorConfig is awesome: https://EditorConfig.org
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

### Configure CI with Git hooks

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev husky@~4.2.0 lint-staged@~10.1.0
```

Add these lines juste after "browserslists" key in "./package.json" file:

```json
  "lint-staged": {
    "./**/*.json": ["prettier --check"],
    "./**/*.js": ["eslint"],
    "./**/*.css": ["prettier --check", "stylelint"],
    "./**/*.yml": ["prettier --check"],
    "./**/*.md": ["markdownlint --ignore ./node_modules"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
```

### Configure CI with GitHub Actions

[Back to top ↑](#table-of-contents)

Create a new "./.github/workflows/lint.yml" file:

```yaml
name: Check coding style and lint code

on: ['push', 'pull_request']

jobs:
  lint:
    runs-on: ubuntu-18.04

    steps:
      - uses: actions/checkout@v2
      - name: Cache node modules
        uses: actions/cache@v1
        env:
          cache-name: cache-node-modules
        with:
          path: ./node_modules
          key: ${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
          restore-keys: ${{ env.cache-name }}-
      - name: Install dependencies
        run: npm install
      - name: "Check coding style and lint code"
        run: npm run lint
```

Create a new "./.github/workflows/test.yml" file:

```yaml
name: Launch unit tests & functional tests

on: ['pull_request']

jobs:
  unit-tests:
    runs-on: ubuntu-18.04

    steps:
      - uses: actions/checkout@v2
      - name: Cache node modules
        uses: actions/cache@v1
        env:
          cache-name: cache-node-modules
        with:
          path: ./node_modules
          key: ${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
          restore-keys: ${{ env.cache-name }}-
      - name: Install dependencies
        run: npm install
      - name: Launch test with Jest
        run: npm run test:all
  functional-tests:
    runs-on: ubuntu-18.04

    steps:
      - uses: actions/checkout@v2
      - name: Cache node modules
        uses: actions/cache@v1
        env:
          cache-name: cache-node-modules
        with:
          path: ./node_modules
          key: ${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
          restore-keys: ${{ env.cache-name }}-
      - name: Install dependencies
        run: npm install
      - name: Launch test with Cypress
        run: npm run cy:run
```

### Integrate formatters, linters & syntax to VSCode

[Back to top ↑](#table-of-contents)

Create a new "./.vscode/extensions.json" file:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "stylelint.vscode-stylelint",
    "davidanson.vscode-markdownlint",
    "me-dutour-mathieu.vscode-github-actions",
    "mikestead.dotenv",
    "editorconfig.editorconfig",
    "eg2.vscode-npm-script"
  ]
}
```

This will suggest to install
[npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script),
[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode),
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),
[StyleLint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint),
[MarkdownLint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint),
[Github Actions](https://marketplace.visualstudio.com/items?itemName=me-dutour-mathieu.vscode-github-actions),
[DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
and [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
extensions to everybody opening this project in VSCode.

Then, create a new "./.vscode/settings.json" file:

```json
{
  "css.validate": false,
  "eslint.enable": true,
  "stylelint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.markdownlint": true,
    "source.fixAll.stylelint": true
  },
  "editor.formatOnSave": true,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.disableLanguages": ["javascript", "javascriptreact", "markdown"]
}
```

This will format automatically the code on save.

## Usage

### Launch app

[Back to top ↑](#table-of-contents)

```bash
npm start
```

### Launch unit tests

[Back to top ↑](#table-of-contents)

```bash
# Test only changes since last commit in watch mode
npm test

# Run all test suite
npm test:all
```

### Launch functional tests

[Back to top ↑](#table-of-contents)

```bash
# Run in terminal
npm run cy:run

# Run in browser
npm run cy:open
```

### Check coding style & Lint code for errors/bad practices

[Back to top ↑](#table-of-contents)

```bash
# Check all files
npm run lint

# Check JavaScript with ESLint (Prettier + StandardJS)
npm run lint:js

# Check CSS with Stylelint (Prettier + Standard)
npm run lint:css

# Check JSON with Prettier
npm run lint:json

# Check YAML with Prettier
npm run lint:yml

# Check Mardkown with MarkdownLint
npm run lint:md
```

### Format code automatically

[Back to top ↑](#table-of-contents)

```bash
# Format all files
npm run format

# Format JavaScript with ESLint (Prettier + StandardJS)
npm run format:js

# Format CSS with Prettier + StyleLint (Standard)
npm run format:css

# Format JSON with Prettier
npm run format:json

# Format YAML with Prettier
npm run format:yml

# Format Mardkown with MarkdownLint
npm run format:md
```

### Audit & fix dependencies vulnerabilities

[Back to top ↑](#table-of-contents)

```bash
# Check for known vulnerabilities in dependencies
npm audit

# Install latest patches of all dependencies
npm update
```

### Check & upgrade outdated dependencies

[Back to top ↑](#table-of-contents)

```bash
# Check for unused/outdated dependencies
npm run deps:check

# Choose interactively which dependency to upgrade
npm run deps:upgrade
```
