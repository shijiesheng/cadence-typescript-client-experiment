export type CadencePrimitive = string | number | boolean | null;

export type CadenceValue =
  | CadencePrimitive
  | CadenceValue[]
  | { [key: string]: CadenceValue };

export interface CadenceClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export interface CadenceScriptRequest {
  script: string;
  arguments?: CadenceValue[];
  blockHeight?: number | "sealed" | "final";
}

export interface CadenceTransactionRequest {
  script: string;
  arguments?: CadenceValue[];
  referenceBlockId?: string;
  proposalKey?: {
    address: string;
    keyId: number;
    sequenceNumber: number;
  };
  payer?: string;
  authorizers?: string[];
  payloadSignatures?: Array<{
    address: string;
    keyId: number;
    signature: string;
  }>;
  envelopeSignatures?: Array<{
    address: string;
    keyId: number;
    signature: string;
  }>;
}
