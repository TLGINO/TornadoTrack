import {
  TornadoCash_ETH_0_1,
  TornadoCash_ETH_1,
  TornadoCash_ETH_10,
  TornadoCash_ETH_100,
  TornadoCash_DAI_100,
  TornadoCash_DAI_1000,
  TornadoCash_DAI_10000,
  TornadoCash_DAI_100000,
  TornadoCash_CDAI_5000,
  TornadoCash_CDAI_50000,
  TornadoCash_CDAI_500000,
  TornadoCash_CDAI_5000000,
  TornadoCash_USDC_100,
  TornadoCash_USDC_1000,
  TornadoCash_USDT_100,
  TornadoCash_USDT_1000,
  TornadoCash_WBTC_0_1,
  TornadoCash_WBTC_1,
  TornadoCash_WBTC_10,
  TornadoCash_BNB_0_1,
  TornadoCash_BNB_1,
  TornadoCash_BNB_10,
  TornadoCash_BNB_100,
  TornadoCash_XDAI_100,
  TornadoCash_XDAI_1000,
  TornadoCash_XDAI_10000,
  TornadoCash_XDAI_100000,
  TornadoCash_AVAX_10,
  TornadoCash_AVAX_100,
  TornadoCash_AVAX_500,
  TornadoCash_MATIC_100,
  TornadoCash_MATIC_1000,
  TornadoCash_MATIC_10000,
  TornadoCash_MATIC_100000,
  TornadoCash_ETH_Deposit_Chain_1,
  TornadoCash_ETH_Withdrawal_Chain_1,
  TornadoCash_ETH_Deposit_Chain_5,
  TornadoCash_ETH_Withdrawal_Chain_5,
  TornadoCash_ETH_Deposit_Chain_56,
  TornadoCash_ETH_Withdrawal_Chain_56,
  TornadoCash_ETH_Deposit_Chain_100,
  TornadoCash_ETH_Withdrawal_Chain_100,
  TornadoCash_ETH_Deposit_Chain_137,
  TornadoCash_ETH_Withdrawal_Chain_137,
  TornadoCash_ETH_Deposit_Chain_42161,
  TornadoCash_ETH_Withdrawal_Chain_42161,
  TornadoCash_ETH_Deposit_Chain_43114,
  TornadoCash_ETH_Withdrawal_Chain_43114,
  TornadoCash_ETH_Deposit_Chain_10,
  TornadoCash_ETH_Withdrawal_Chain_10,
  TornadoCashCurrency,
  TornadoCashAmount,
} from "generated";

type DepositEntity =
  | TornadoCash_ETH_Deposit_Chain_1
  | TornadoCash_ETH_Deposit_Chain_5;
type WithdrawalEntity =
  | TornadoCash_ETH_Withdrawal_Chain_1
  | TornadoCash_ETH_Withdrawal_Chain_5;

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
      context.TornadoCash_ETH_Deposit_Chain_1.set(
        entity as TornadoCash_ETH_Deposit_Chain_1
      );
    } else if (chainId === 5) {
      context.TornadoCash_ETH_Deposit_Chain_5.set(
        entity as TornadoCash_ETH_Deposit_Chain_5
      );
    } else if (chainId === 56) {
      context.TornadoCash_ETH_Deposit_Chain_56.set(
        entity as TornadoCash_ETH_Deposit_Chain_56
      );
    } else if (chainId === 100) {
      context.TornadoCash_ETH_Deposit_Chain_100.set(
        entity as TornadoCash_ETH_Deposit_Chain_100
      );
    } else if (chainId === 137) {
      context.TornadoCash_ETH_Deposit_Chain_137.set(
        entity as TornadoCash_ETH_Deposit_Chain_137
      );
    } else if (chainId === 42161) {
      context.TornadoCash_ETH_Deposit_Chain_42161.set(
        entity as TornadoCash_ETH_Deposit_Chain_42161
      );
    } else if (chainId === 43114) {
      context.TornadoCash_ETH_Deposit_Chain_43114.set(
        entity as TornadoCash_ETH_Deposit_Chain_43114
      );
    } else if (chainId === 10) {
      context.TornadoCash_ETH_Deposit_Chain_10.set(
        entity as TornadoCash_ETH_Deposit_Chain_10
      );
    }
  } else {
    const entity: WithdrawalEntity = {
      ...baseEntity,
      to: event.params.to,
      nullifierHash: event.params.nullifierHash,
      relayer: event.params.relayer,
      fee: event.params.fee,
    };
    if (chainId === 1) {
      context.TornadoCash_ETH_Withdrawal_Chain_1.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_1
      );
    } else if (chainId === 5) {
      context.TornadoCash_ETH_Withdrawal_Chain_5.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_5
      );
    } else if (chainId === 56) {
      context.TornadoCash_ETH_Withdrawal_Chain_56.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_56
      );
    } else if (chainId === 100) {
      context.TornadoCash_ETH_Withdrawal_Chain_100.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_100
      );
    } else if (chainId === 137) {
      context.TornadoCash_ETH_Withdrawal_Chain_137.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_137
      );
    } else if (chainId === 42161) {
      context.TornadoCash_ETH_Withdrawal_Chain_42161.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_42161
      );
    } else if (chainId === 43114) {
      context.TornadoCash_ETH_Withdrawal_Chain_43114.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_43114
      );
    } else if (chainId === 10) {
      context.TornadoCash_ETH_Withdrawal_Chain_10.set(
        entity as TornadoCash_ETH_Withdrawal_Chain_10
      );
    }
  }
}

type ContractDetails = {
  contract: any;
  currency: TornadoCashCurrency;
  amount: TornadoCashAmount;
};

// Should be able to reuse the same endpoints for other network
const contracts: ContractDetails[] = [
  { contract: TornadoCash_ETH_0_1, currency: "ETH", amount: "V_0_1" },
  { contract: TornadoCash_ETH_1, currency: "ETH", amount: "V_1" },
  { contract: TornadoCash_ETH_10, currency: "ETH", amount: "V_10" },
  { contract: TornadoCash_ETH_100, currency: "ETH", amount: "V_100" },
  { contract: TornadoCash_DAI_100, currency: "DAI", amount: "V_100" },
  { contract: TornadoCash_DAI_1000, currency: "DAI", amount: "V_1000" },
  { contract: TornadoCash_DAI_10000, currency: "DAI", amount: "V_10000" },
  { contract: TornadoCash_DAI_100000, currency: "DAI", amount: "V_100000" },
  { contract: TornadoCash_CDAI_5000, currency: "CDAI", amount: "V_5000" },
  { contract: TornadoCash_CDAI_50000, currency: "CDAI", amount: "V_50000" },
  { contract: TornadoCash_CDAI_500000, currency: "CDAI", amount: "V_500000" },
  { contract: TornadoCash_CDAI_5000000, currency: "CDAI", amount: "V_5000000" },
  { contract: TornadoCash_USDC_100, currency: "USDC", amount: "V_100" },
  { contract: TornadoCash_USDC_1000, currency: "USDC", amount: "V_1000" },
  { contract: TornadoCash_USDT_100, currency: "USDT", amount: "V_100" },
  { contract: TornadoCash_USDT_1000, currency: "USDT", amount: "V_1000" },
  { contract: TornadoCash_WBTC_0_1, currency: "WBTC", amount: "V_0_1" },
  { contract: TornadoCash_WBTC_1, currency: "WBTC", amount: "V_1" },
  { contract: TornadoCash_WBTC_10, currency: "WBTC", amount: "V_10" },
  { contract: TornadoCash_BNB_0_1, currency: "BNB", amount: "V_0_1" },
  { contract: TornadoCash_BNB_1, currency: "BNB", amount: "V_1" },
  { contract: TornadoCash_BNB_10, currency: "BNB", amount: "V_10" },
  { contract: TornadoCash_BNB_100, currency: "BNB", amount: "V_100" },
  { contract: TornadoCash_XDAI_100, currency: "XDAI", amount: "V_100" },
  { contract: TornadoCash_XDAI_1000, currency: "XDAI", amount: "V_1000" },
  { contract: TornadoCash_XDAI_10000, currency: "XDAI", amount: "V_10000" },
  { contract: TornadoCash_XDAI_100000, currency: "XDAI", amount: "V_100000" },
  { contract: TornadoCash_AVAX_10, currency: "AVAX", amount: "V_10" },
  { contract: TornadoCash_AVAX_100, currency: "AVAX", amount: "V_100" },
  { contract: TornadoCash_AVAX_500, currency: "AVAX", amount: "V_500" },
  { contract: TornadoCash_MATIC_100, currency: "MATIC", amount: "V_100" },
  { contract: TornadoCash_MATIC_1000, currency: "MATIC", amount: "V_1000" },
  { contract: TornadoCash_MATIC_10000, currency: "MATIC", amount: "V_10000" },
  { contract: TornadoCash_MATIC_100000, currency: "MATIC", amount: "V_100000" },
];

// Register handlers dynamically
contracts.forEach(({ contract, currency, amount }) => {
  contract.Deposit.handler(async (args: any) => {
    await handleEvent(args.event, args.context, "Deposit", currency, amount);
  });

  contract.Withdrawal.handler(async (args: any) => {
    await handleEvent(args.event, args.context, "Withdrawal", currency, amount);
  });
});
