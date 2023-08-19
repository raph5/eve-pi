import type { Token } from "@lib/eveApi/sso";
import { JsonStorage } from "./storage";

const tokenStorageInterface = new JsonStorage<Record<string, Token>>('tokenStorage')

if(tokenStorageInterface.read()) {
  tokenStorageInterface.set({})
}

function add(token: Token) {
  const tokens = tokenStorageInterface.read()
  tokens[token.decoded_access_token.name] = token
  tokenStorageInterface.set(tokens)
}

function remove(tokenName: string) {
  const tokens = tokenStorageInterface.read()
  delete tokens[tokenName]
  tokenStorageInterface.set(tokens)
}

function getAll(): Record<string, Token> {
  return tokenStorageInterface.read()
}

function setAll(tokens: Record<string, Token>) {
  tokenStorageInterface.set(tokens)
}

export default { add, remove, getAll, setAll }