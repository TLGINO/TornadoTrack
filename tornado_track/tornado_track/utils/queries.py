DEPOSITS_QUERY = """
query ($chainId: Int!, $currencyList: [tornadocashcurrency!]!) {
  TornadoCash_ETH_Deposit(
    where: {
      chain: { _eq: $chainId },
      currency: { _in: $currencyList }
    }
  ) {
    amount
    currency
    timestamp
  }
}
"""


WITHDRAWALS_QUERY = """
query ($chainId: Int!, $currencyList: [tornadocashcurrency!]!) {
  TornadoCash_ETH_Withdrawal(
    where: {
      chain: { _eq: $chainId },
      currency: { _in: $currencyList }
    }
  ) {
    amount
    currency
    timestamp
  }
}
"""
