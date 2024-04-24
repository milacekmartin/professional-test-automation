# TA

## Installation

```shell
yarn install && yarn cypress verify
```

yarn can be downloaded from: `https://classic.yarnpkg.com/en/docs/install`

## Open Cypress UI for test environment

```shell
yarn cy:<config>:open
```

`<config>`: you can find all configs in `cypress/configs`

## Execute tests headlessly

```shell
yarn cy:<config>:run
```

## Generate reports

```shell
yarn allure:report
```
