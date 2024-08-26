/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  TornadoCash_Eth_01,
  TornadoCash_Eth_01_Deposit,
  TornadoCash_Eth_01_Withdrawal,
} from "generated";

TornadoCash_Eth_01.Deposit.handler(async ({ event, context }) => {
  const entity: TornadoCash_Eth_01_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    commitment: event.params.commitment,
    leafIndex: event.params.leafIndex,
    timestamp: event.params.timestamp,
  };

  context.TornadoCash_Eth_01_Deposit.set(entity);
});


TornadoCash_Eth_01.Withdrawal.handler(async ({ event, context }) => {
  const entity: TornadoCash_Eth_01_Withdrawal = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    to: event.params.to,
    nullifierHash: event.params.nullifierHash,
    relayer: event.params.relayer,
    fee: event.params.fee,
  };

  context.TornadoCash_Eth_01_Withdrawal.set(entity);
});

