DEPOSITS_QUERY = """
query ($chainId: Int!, $desiredCurrency: tornadocashcurrency!) {
  TornadoCash_ETH_Deposit(
    where: {
      chain: { _eq: $chainId },
      currency: { _eq: $desiredCurrency }
    }
  ) {
    amount
    currency
    timestamp
  }
}
"""


WITHDRAWALS_QUERY = """
query ($chainId: Int!, $desiredCurrency: tornadocashcurrency!) {
  TornadoCash_ETH_Withdrawal(
    where: {
      chain: { _eq: $chainId },
      currency: { _eq: $desiredCurrency }
    }
  ) {
    amount
    currency
    timestamp
  }
}
"""
