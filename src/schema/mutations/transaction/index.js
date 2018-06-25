import signString from "./signString"
import signTransaction  from "./signTransaction"
import broadcastTransaction from "./broadcastTransaction"
import generateBlockChainKeyPair from "./generateBlockChainKeyPair"
import registerBlockChainPublicKey from "./registerBlockChainPublicKey"
import { collectDefinitions } from "/schema/utils"


export default collectDefinitions(
  signString,
  signTransaction,
  broadcastTransaction,
  generateBlockChainKeyPair,
  registerBlockChainPublicKey,
)
