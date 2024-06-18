import { BigInt } from "@graphprotocol/graph-ts";

import { Transfer as TransferEvent } from "../generated/CampNFT/CampNFT";

import { Token, Account } from "../generated/schema";

import { CampNFT as CampNFTABI } from "../generated/CampNFT/CampNFT";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(ev: TransferEvent): void {
  let token = Token.load(ev.params.tokenId.toString());
  let from = Account.load(ev.params.from.toHex());
  let to = Account.load(ev.params.to.toHex());
  // ev.block.number;
  if (from == null) {
    from = new Account(ev.params.from.toHex());
    from.tokensOwned = BigInt.fromI32(1);
  }
  if (from.id != ZERO_ADDRESS) {
    // from.tokensOwned -= BigInt.fromI32(1);
    from.tokensOwned = from.tokensOwned.minus(BigInt.fromI32(1));
  }
  from.save();

  if (to == null) {
    to = new Account(ev.params.to.toHex());
    to.tokensOwned = BigInt.fromI32(0);
  }
  // to.tokensOwned += BigInt.fromI32(1);
  to.tokensOwned = to.tokensOwned.plus(BigInt.fromI32(1));
  to.save();

  if (token == null) {
    token = new Token(ev.params.tokenId.toString());
    token.tokenID = ev.params.tokenId;
    const tokenContract = CampNFTABI.bind(ev.address);
    token.tokenURI = tokenContract.tokenURI(ev.params.tokenId);
  }
  token.owner = to.id;
  token.save();
}
