# cadence-typescript-client-experiment

A basic TypeScript SDK for interacting with Cadence endpoints.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

```ts
import { CadenceClient, cadence } from "cadence-typescript-client-experiment";

const client = new CadenceClient({
  baseUrl: "http://localhost:8888",
});

const script = cadence`
  access(all) fun main(): Int {
    return 42
  }
`;

const result = await client.executeScript<{ value: string }>({ script });
console.log(result);
```
