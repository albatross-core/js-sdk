

# @albatrossai/albatross-sdk

[![NPM package](https://badge.fury.io/js/%40albatrossai%2Falbatross-sdk.svg)](https://www.npmjs.com/package/@albatrossai/albatross-sdk)
[![NPM package](https://img.shields.io/npm/v/@albatrossai/albatross-sdk.svg)](https://www.npmjs.com/package/@albatrossai/albatross-sdk)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An SDK for interacting with the Albatross AI ranking service.

## Installation

```bash
npm install @albatrossai/albatross-sdk
# or
yarn add @albatrossai/albatross-sdk
# or 
bun install @albatrossai/albatross-sdk
```

## Quick Start

```typescript
import { AlbatrossClient } from '@albatrossai/albatross-sdk';

const client = new AlbatrossClient({
  apiKey: 'your_api_key',
  instanceId: 'your_instance_id',
  environment: 'production' // or 'staging'
});

// Record a search event
const event = {
  eventType: 'search',
  units: {
    user: 'user123',
    sessionId: 'session123',
    deviceOs: 'iOS'
  },
  payload: {
    searchId: 'search123',
    userLocation: 'US',
    checkInDate: '2024-06-01',
    checkOutDate: '2024-06-07',
    numberOfGuests: 2
  },
  timestamp: new Date().toISOString()
};

await client.events.track(event);
```


