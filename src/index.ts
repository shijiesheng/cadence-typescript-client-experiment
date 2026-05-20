export { CadenceClient, CadenceHttpError } from "./client.js";
export type {
  CadenceClientOptions,
  CadenceScriptRequest,
  CadenceTransactionRequest,
  CadenceValue,
} from "./types.js";

export function cadence(
  strings: TemplateStringsArray,
  ...values: Array<string | number | boolean>
): string {
  return strings.reduce((result, part, index) => {
    const value = values[index];
    return `${result}${part}${value === undefined ? "" : String(value)}`;
  }, "");
}
