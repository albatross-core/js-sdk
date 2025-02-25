

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


## Custom Request Handler

The Albatross Client accepts a custom request handler through its constructor, allowing you to replace the default `fetch`-based implementation. This is particularly useful in environments where `fetch` is unavailable (like older Node.js versions) or when you need special request handling. Simply implement a function matching the `makeRequest` signature and pass it to the Client constructor. For example, you can use Axios, XMLHttpRequest, or Node's http module as alternatives. This flexibility ensures the Albatross Client works across various JavaScript environments while maintaining consistent API interactions.

### Example: Using Axios

```typescript
import axios from 'axios';
import Client from './albatross-client';

// Custom makeRequest implementation using Axios
const axiosRequest = async <A, B extends Record<string, any>>({
  url,
  method = "GET",
  data,
  headers,
}: MakeRequestInputs<B>): Promise<A> => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Request failed: ${error.response.status} ${error.response.statusText} ${JSON.stringify(error.response.data)}`
      );
    }
    throw error;
  }
};

// Initialize client with custom request handler
const client = new Client(
  "your-token",
  "your-instance-uuid",
  "https://app.usealbatross.ai/api",
  axiosRequest
);
```

