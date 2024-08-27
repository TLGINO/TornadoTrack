import {
  TornadoCash_ETH_0_1,
  TornadoCash_ETH_1,
  TornadoCash_DAI_100,
  TornadoCash_ETH_Deposit_Chain_1,
  TornadoCash_ETH_Withdrawal_Chain_1,
  // TornadoCash_ETH_Deposit_Chain_2,
  // TornadoCash_ETH_Withdrawal_Chain_2,
  TornadoCashCurrency,
  TornadoCashAmount,
} from "generated";

type DepositEntity = TornadoCash_ETH_Deposit_Chain_1 //| TornadoCash_ETH_Deposit_Chain_2;
type WithdrawalEntity = TornadoCash_ETH_Withdrawal_Chain_1// | TornadoCash_ETH_Withdrawal_Chain_2;

// Generic handler function
async function handleEvent(
  event: any,
  context: any,
  entityType: "Deposit" | "Withdrawal",
  currency: TornadoCashCurrency,
  amount: TornadoCashAmount
) {
  const chainId = event.chainId;
  const baseEntity = {
    id: `${chainId}_${event.block.number}_${event.logIndex}`,
    currency,
    amount,
  };

  if (entityType === "Deposit") {
    const entity: DepositEntity = {
      ...baseEntity,
      commitment: event.params.commitment,
      leafIndex: event.params.leafIndex,
      timestamp: event.params.timestamp,
    };
    if (chainId === 1) {
      context.TornadoCash_ETH_Deposit_Chain_1.set(entity as TornadoCash_ETH_Deposit_Chain_1);
    }
    // else if (chainId === 2) {
    //   context.TornadoCash_ETH_Deposit_Chain_2.set(entity as TornadoCash_ETH_Deposit_Chain_2);
    // }
  } else {
    const entity: WithdrawalEntity = {
      ...baseEntity,
      to: event.params.to,
      nullifierHash: event.params.nullifierHash,
      relayer: event.params.relayer,
      fee: event.params.fee,
    };
    if (chainId === 1) {
      context.TornadoCash_ETH_Withdrawal_Chain_1.set(entity as TornadoCash_ETH_Withdrawal_Chain_1);
    }
    // else if (chainId === 2) {
    //   context.TornadoCash_ETH_Withdrawal_Chain_2.set(entity as TornadoCash_ETH_Withdrawal_Chain_2);
    // }
  }
}

// Register handlers for ETH 0.1
TornadoCash_ETH_0_1.Deposit.handler(async (args) => {
  await handleEvent(args.event, args.context, "Deposit", "ETH","V_0_1");
});

TornadoCash_ETH_0_1.Withdrawal.handler(async (args) => {
  await handleEvent(args.event, args.context, "Withdrawal", "ETH", "V_0_1");
});

// Register handlers for ETH 1
TornadoCash_ETH_1.Deposit.handler(async (args) => {
  await handleEvent(args.event, args.context, "Deposit", "ETH", "V_1");
});

TornadoCash_ETH_1.Withdrawal.handler(async (args) => {
  await handleEvent(args.event, args.context, "Withdrawal", "ETH", "V_1");
});

// Register handlers for DAI 100
TornadoCash_DAI_100.Deposit.handler(async (args) => {
  await handleEvent(args.event, args.context, "Deposit", "DAI", "V_100");
});

TornadoCash_DAI_100.Withdrawal.handler(async (args) => {
  await handleEvent(args.event, args.context, "Withdrawal", "DAI", "V_100");
});