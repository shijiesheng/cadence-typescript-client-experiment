import {
  type CadenceClientOptions,
  type CadenceScriptRequest,
  type CadenceTransactionRequest,
} from "./types.js";

export class CadenceHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "CadenceHttpError";
    this.status = status;
  }
}

export class CadenceClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: CadenceClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async executeScript<T = unknown>(request: CadenceScriptRequest): Promise<T> {
    const blockHeight = request.blockHeight ?? "sealed";
    const url = this.buildUrl("/v1/scripts", { block_height: String(blockHeight) });

    return this.request<T>(url, {
      script: request.script,
      arguments: request.arguments ?? [],
    });
  }

  async submitTransaction<T = unknown>(request: CadenceTransactionRequest): Promise<T> {
    return this.request<T>(this.buildUrl("/v1/transactions"), {
      script: request.script,
      arguments: request.arguments ?? [],
      referenceBlockId: request.referenceBlockId,
      proposalKey: request.proposalKey,
      payer: request.payer,
      authorizers: request.authorizers,
      payloadSignatures: request.payloadSignatures,
      envelopeSignatures: request.envelopeSignatures,
    });
  }

  private async request<T>(url: string, body: object): Promise<T> {
    const response = await this.fetchImpl(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CadenceHttpError(
        response.status,
        errorText || `Cadence request failed with status ${response.status}`,
      );
    }

    return (await response.json()) as T;
  }

  private buildUrl(path: string, query: Record<string, string> = {}): string {
    const url = new URL(`${this.baseUrl}${path}`);

    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  }
}
