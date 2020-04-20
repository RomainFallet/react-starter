# React starter

The purpose of this repository is to provide instructions to create
and configure a new [React](https://reactjs.org/) app from scratch
with appropriate linters, editor config, testing utilities and
continuous integration.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Manual configuration](#manual-configuration)
  - [Init the project](#init-the-project)
  - [Create default app](#create-default-app)
  - [Install Cypress & testing utilities](#install-cypress--testing-utilities)
  - [Install Prettier code formatter](#install-prettier-code-formatter)
  - [Install ESLint code linter with StandardJS rules](#install-eslint-code-linter-with-standardjs-rules)
  - [Install StyleLint code linter with Standard rules](#install-stylelint-code-linter-with-standard-rules)
  - [Install MarkdownLint code linter](#install-markdownLint-code-linter)
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

## Prerequisites

- Git v2
- NodeJS v12
- NPM v6

## Quickstart

```bash
# Clone repo
git clone https://github.com/RomainFallet/react-starter

# Go inside the project
cd ./react-starter
```

## Manual configuration

### Init the project

[Back to top ↑](#table-of-contents)

Create a new "./.npmrc" file:

```text
save-prefix='~'
```

Set up the project:

```bash
# Create app
npm init react-app@~3.4.0 --use-npm ./<my_project_name>

# Go inside the project
cd ./<my_project_name>

# Install others packages
npm install react-router-dom@~5.1.0 axios@~0.19.0
npm install --save-dev npm-run-all@~4.1.5
```

Replace caret (^) by tilde (~) in package.json versions,
then remove "./package-lock.json" and "./node_modules" and re-install deps:

```bash
npm install
```

Create a new empty "./.env" file at the root of the project.

### Create default app

[Back to top ↑](#table-of-contents)

First, remove "./src/App.js", "./src/App.test.js",
"./src/App.css" and "./src/logo.svg" files.

Then, edit the "./src/index.js" file like this:

```javascript
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import './index.css'
import CatsList from './containers/CatsList/CatsList'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/">
          <CatsList />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
```

Edit the "./src/index.css" file like this:

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}
```

Create a new "./src/containers/CatsList/CatsList.js" file:

```javascript
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './CatsList.module.css'

const CatsList = () => {
  const [cats, setCats] = useState([])

  useEffect(() => {
    fetchCats()
  }, [])

  const fetchCats = async () => {
    const response = await axios.get(
      'https://api.thecatapi.com/v1/images/search?limit=5'
    )
    setCats(response.data)
  }

  return (
    <React.Fragment>
      <h1>Cats list</h1>
      <button type="button" onClick={fetchCats}>
        I want new cats!
      </button>
      <ul>
        {cats.map(cat => (
          <li key={cat.id}>
            <img
              className={styles.Cat}
              width="300"
              height="200"
              src={cat.url}
              alt="Cat"
            />
          </li>
        ))}
      </ul>
    </React.Fragment>
  )
}

export default CatsList
```

Create a new "./src/containers/CatsList/CatsList.test.js" file:

```javascript
import React from 'react'
import { render, wait, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import CatsList from './CatsList'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const axiosMock = new MockAdapter(axios)
expect.extend(toHaveNoViolations)

describe('<CatsList />', () => {
  it('should display cats when component is loaded', async () => {
    // Arrange
    expect.assertions(4)
    axiosMock.reset()
    axiosMock.onGet().reply(200, [
      { id: 1, url: 'https://example.com' },
      { id: 2, url: 'https://example.com' }
    ])
    jest.clearAllMocks()
    jest.spyOn(axios, 'get')

    // Act
    const { findAllByAltText, container } = render(<CatsList />)
    const cats = await findAllByAltText('Cat')

    // Assert
    expect(await axe(container)).toHaveNoViolations()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/images/search?limit=5'
    )
    expect(cats).toHaveLength(2)
  })

  it('should be able to display new cats manually', async () => {
    // Arrange
    expect.assertions(3)
    axiosMock.reset()
    axiosMock.onGet().reply(200, [
      { id: 1, url: 'https://example.com' },
      { id: 2, url: 'https://example.com' }
    ])
    jest.clearAllMocks()
    jest.spyOn(axios, 'get')
    const { findAllByAltText, getByText } = render(<CatsList />)
    await wait()
    const button = getByText('I want new cats!')

    // Act
    fireEvent.click(button)
    const cats = await findAllByAltText('Cat')

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(axios.get).toHaveBeenLastCalledWith(
      'https://api.thecatapi.com/v1/images/search?limit=5'
    )
    expect(cats).toHaveLength(2)
  })
})
```

Create a new "./src/containers/CatsList/CatsList.module.css" file:

```css
.Cat {
  object-fit: cover;
}
```

Create a new "./cypress/integration/CatsList.spec.js" file:

```javascript
describe('feature CatsList', () => {
  it('displays all the cats', () => {
    // Act
    cy.visit('/')

    // Assert
    cy.findAllByAltText('Cat').should('have.length', 5)
  })

  it('displays new cats after hitting reload button', () => {
    // Arrange
    cy.visit('/')

    // Act
    cy.findByText('I want new cats!').click()

    // Assert
    cy.findAllByAltText('Cat').should('have.length', 5)
  })
})
```

### Install Cypress & testing utilities

[Back to top ↑](#table-of-contents)

Install packages:

```bash
# Install Cypress
npm i -D cypress@~4.3.0 @testing-library/cypress@~6.0.0

# Install other tools
npm i -D axios-mock-adapter@~1.18.0 jest-axe@~3.4.0 identity-obj-proxy@~3.0.0
```

Add these scripts in "./package.json" file:

```json
  "scripts": {
    "cy:run": "cypress run",
    "cy:open": "cypress open"
  },
```

Create a new "./cypress.json" file:

```json
{
  "baseUrl": "http://localhost:3000"
}
```

Generate cypress files:

```bash
# Start the app
npm start

# Start Cypress
npm run cy:run
```

Add this line to "./cypress/support/commands.js" file:

```javascript
import '@testing-library/cypress/add-commands'
```

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
# Install ESLint default plugins
npm i -D eslint-plugin-promise@~4.2.0 eslint-plugin-import@~2.20.0 eslint-plugin-node@~11.1.0

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
      "react-app",
      "standard",
      "prettier-standard"
    ],
    "overrides": [
      {
        "files": [
          "./src/**/*.test.js"
        ],
        "extends": "plugin:jest/all"
      },
      {
        "files": [
          "./cypress/**/*.spec.js"
        ],
        "extends": "plugin:cypress/recommended"
      }
    ],
    "plugins": ["jest", "cypress"],
    "ignorePatterns": [
      "node_modules"
    ]
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

Format existing files:

```bash
npm run format:js
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

### Install MarkdownLint code linter

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
    "./**/*.json": [
      "prettier --check"
    ],
    "./**/*.js": [
      "eslint"
    ],
    "./**/*.css": [
      "prettier --check",
      "stylelint"
    ],
    "./**/*.yml": [
      "prettier --check"
    ],
    "./**/*.md": [
      "markdownlint --ignore ./node_modules"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
```

### Configure CI with GitHub Actions

[Back to top ↑](#table-of-contents)

Create a new "./.github/workflows/lint.yml" file:

```yaml
name: Check coding style and lint code

on: ["push", "pull_request"]

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

on: ["pull_request"]

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
          path: ~/.npm
          key: ${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
          restore-keys: ${{ env.cache-name }}-
      - name: Install dependencies
        run: npm install
      - name: Launch test with Jest
        run: npm test
  functional-tests:
    runs-on: ubuntu-18.04

    steps:
      - uses: actions/checkout@v2
      - name: Cache node modules
        uses: actions/cache@v1
        env:
          cache-name: cache-node-modules
        with:
          path: ~/.npm
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
  "editor.defaultFormatter": "esbenp.prettier-vscode",
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
npm run test:all
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
