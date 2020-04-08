# Fastify starter

The purpose of this repository is to provide instructions to create and configure a new [Fastify](https://www.fastify.io/) app from scratch with appropriate linters, editor config, testing utilities, continuous integration on Ubuntu, macOS and Windows.

On Windows, commands are meant to be executed on PowerShell.

## Table of contents

- [Quickstart](#quickstart)
- [Manual configuration](#manual-configuration)
  - [Init the project](#init-the-project)
  - [Install Cypress & testing utilities](#install-cypress--testing-utilities)
  - [Install Prettier code formatter](#install-prettier-code-formatter)
  - [Install ESLint code linter with StandardJS rules](#install-eslint-code-linter-with-standardjs-rules)
  - [Install npm-check dependencies checker](#install-dependencies-checker)
  - [Install dotenv-flow](#install-dotenv)
  - [Configure .gitignore](#configure-gitignore)
  - [Configure .editorconfig](#configure-editorconfig)
  - [Configure CI with Git hooks](#configure-ci-with-git-hooks)
  - [Configure CI with GitHub Actions](#configure-ci-with-github-actions)
- [Usage](#usage)
  - [Launch app](#launch-app)
  - [Launch unit tests & functional tests](#launch-unit-tests--functional-tests)
  - [Check coding style & Lint code for errors/bad practices](#check-coding-style--lint-code-for-errorsbad-practices)
  - [Format code automatically](#format-code-automatically)
  - [Audit & fix dependencies vulnerabilities](#audit--fix-dependencies-vulnerabilities)
  - [Check & upgrade outdated dependencies](#check--upgrade-outdated-dependencies)

## Quickstart

```bash
git clone https://github.com/RomainFallet/fastify-starter
```

## Manual configuration

### Init the project

[Back to top ↑](#table-of-contents)

Define npm prefix:

```bash
# Set NPM prefix
npm config set save-prefix='~'

# Create app
npx create-react-app react-starter --use-npm

# Install others packages
npm install axios@~0.19.0
npm install --save-dev npm-run-all@~4.1.5

# Replace caret by tilde in package.json versions (MacOS & Ubuntu)
sed -i'.tmp' -e 's/"^/"~/g' ./package.json && rm ./package.json.tmp

# Replace caret by tilde in package.json versions (Windows)
((Get-Content -path ./package.json -Raw) -replace '"^','"~') | Set-Content -Path ./package.json

# Re-install deps
npm install
```

### Install Cypress & testing utilities

[Back to top ↑](#table-of-contents)

Install packages:

```bash
npm install --save-dev cypress@~4.3.0 axios-mock-adapter@~1.18.0 @testing-library/cypress@~6.0.0 jest-axe@~3.4.0 identity-obj-proxy@~3.0.0
```

Add this script in "./package.json" file:

```json
...
  "scripts": {
    ...
    "test:all": "react-scripts test --watchAll=false"
  },
...
```

### Install Prettier code formatter

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev prettier@~2.0.0 eslint-plugin-prettier@~3.1.0 eslint-config-prettier@~6.10.0 prettier-config-standard@~1.0.0 eslint-config-prettier-standard@~3.0.0
```

Add these scripts to "./package.json" file:

```json
...
  "scripts": {
    ...
    "lint:json": "prettier --check \"./**/*.json\"",
    "format:json": "prettier --write \"./**/*.json\"",
  },
...
```

### Install ESLint code linter with StandardJS rules

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev eslint@~6.8.0 eslint-plugin-standard@~4.0.0 eslint-plugin-promise@~4.2.0 eslint-plugin-import@~2.20.0 eslint-plugin-node@~11.1.0 eslint-config-standard@~14.1.0 eslint-plugin-jest@~23.8.0 eslint-plugin-cypress@~2.10.0
```

Remove the "eslintConfig" key from "./package.json" file, then, create a new "./.eslintrc.json" file:

```json
{
  "extends": ["plugin:jest/all", "plugin:cypress/recommended", "standard", "prettier-standard"],
  "plugins": ["jest", "cypress"]
}
```

Add these scripts to "./package.json" file:

```json
...
  "scripts": {
    ...
    "lint:js": "eslint \"./**/*.js\"",
    "format:js": "eslint --fix \"./**/*.js\"",
  },
...
```

### Install StyleLint code linter with Standard rules

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev stylelint@~13.0.0 stylelint-config-standard@~19.0.0 stylelint-config-prettier@~8.0.0
```

Create a new "./.stylelintrc.json":

```bash
{
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"]
}
```

Add these scripts to "./package.json" file:

```json
...
  "scripts": {
    ...
    "lint:css": "prettier --check \"./**/*.css\" && stylelint \"./**/*.css\"",
    "format:css": "prettier --write \"./**/*.css\"",
    "lint": "npm-run-all lint:*",
    "format": "npm-run-all format:*"
  },
...
```

### Install dependencies checker

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev npm-check@~5.9.0
```

Add these scripts to "./package.json" file:

```json
...
  "scripts": {
    ...
    "deps:check": "npm-check",
    "deps:upgrade": "npm-check -u"
  },
...
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
...
  "lint-staged": {
    "./**/*.json": ["prettier --check"],
    "./**/*.js": ["eslint"],
    "./**/*.css": ["prettier --check", "stylelint"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
...
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
        key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
        restore-keys: ${{ runner.os }}-build-${{ env.cache-name }}-
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
  test:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Cache node modules
      uses: actions/cache@v1
      env:
        cache-name: cache-node-modules
      with:
        path: ./node_modules
        key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
        restore-keys: ${{ runner.os }}-build-${{ env.cache-name }}-
    - name: Install dependencies
      run: npm install
    - name: Launch test with Jest
      run: npm run test:all
```

## Usage

### Launch app

[Back to top ↑](#table-of-contents)

```bash
npm start
```

### Launch unit tests & functional tests

[Back to top ↑](#table-of-contents)

```bash
# Test only changes since last commit in watch mode
npm test

# Run all test suite
npm test:all
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
```

### Format code automatically

[Back to top ↑](#table-of-contents)

```bash
# Format all files
npm run format

# Format JavaScript with ESLint (Prettier + StandardJS)
npm run format:js

# Format CSS with Prettier
npm run format:css

# Format JSON with Prettier
npm run format:json
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
