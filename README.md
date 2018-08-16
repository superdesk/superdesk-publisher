# Superdesk Publisher


## Overview
This is a plugin for [superdesk](https://github.com/superdesk/superdesk).
The Superdesk Publisher is an API-centric delivery tool for all digital platforms. Written from scratch in 2016, it utilizes the knowledge gained from 17 years of delivering digital news at scale with Newscoop. The Publisher is designed to work with any editorial system. Naturally, it works the best with our in-house newsroom management system, Superdesk. Therefore, it allows independent maintenance, upgrade and change of the editorial back-end system.

## Configure Superdesk
In order for Superdesk to expose the Publisher module, you must configure it in client config files.

### Client
Add the dependency to your instance of superdesk.
In `superdesk/client/package.json` add `superdesk-publisher` to the dependencies
(replacing `#a79d428` with the specific commit you require):
```js
"dependencies": {
    ....,
    "superdesk-publisher": "superdesk/superdesk-publisher#a79d428"
}
```

After that, run npm install to install additional dependencie.

Don't forget to add publisher to your superdesk config in `superdesk/client/superdesk.config.js`, and
to enable the publisher feature:
```js
apps: [
    ....,
    'superdesk-publisher'
],
publisher: {
    protocol: 'http',
    tenant: 'tenant-1',
    domain: 'website.com',
    base: 'api/v1',
    wsDomain: 'WebSocketDomain.com',
    wsPath: '/ws',
    wsPort: '8080'
},
```

publisher.tenant - publisher tenant name
publisher.domain - publisher domain
publisher.base - publisher base url
publisher.wsDomain - publisher websocket domain address
publisher.wsPort - publisher websocket path
publisher.wsPort - publisher websocket port

This will import the `superdesk-publisher` node module and load the `superdesk.publisher` angular module in the main angular application.

## Install for Development

First you will need to clone the repo from GitHub.
In the root folder where your current superdesk folder is, run the following:
```
git clone git@github.com:superdesk/superdesk-publisher.git
```

### Client
Running the following will link the superdesk-publisher module in development mode:
```
cd superdesk/client
npm install
npm link ../../superdesk-publisher
cd ../..
```

## Running Tests

### Client
Code Style
```
cd superdesk-publisher
npm run hint
cd ..
```

Unit Tests
```
cd superdesk-publisher
npm run unit_test
cd ..
```