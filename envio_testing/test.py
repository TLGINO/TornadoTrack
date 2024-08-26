import hypersync
import asyncio
import time
from hypersync import LogField, TransactionField


TORNADO_0_1_ETH = "0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc"
TORNADO_1_ETH = "0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936"
TORNADO_10_ETH = "0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF"
TORNADO_100_ETH = "0xA160cdAB225685dA1d56aa342Ad8841c3b53f291"


async def main():
    client = hypersync.HypersyncClient(hypersync.ClientConfig())

    height = await client.get_height()

    query = hypersync.Query(
        from_block=20613373,
        to_block=height,
        logs=[
            hypersync.LogSelection(
                address=[
                    TORNADO_0_1_ETH,
                    TORNADO_1_ETH,
                    TORNADO_10_ETH,
                    TORNADO_100_ETH,
                ],
                topics=[
                    [
                        "0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196",  # Deposit
                        "0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931",  # Withdrawal
                    ]
                ],
            )
        ],
        field_selection=hypersync.FieldSelection(
            # log=[
            #     LogField.DATA,
            #     LogField.ADDRESS,
            #     LogField.TOPIC0,
            #     LogField.TOPIC1,
            #     LogField.TRANSACTION_HASH,
            # ]
            log=[el.value for el in LogField],
            transaction=[el.value for el in TransactionField],
            block=[el.value for el in hypersync.BlockField],
        ),
    )

    decoder = hypersync.Decoder(
        [
            "Deposit (bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp)",
            "Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)",
        ]
    )

    while True:
        res = await client.get(query)

        if len(res.data.logs) > 0:
            decoded_logs = await decoder.decode_logs(res.data.logs)

            for i, log in enumerate(decoded_logs):
                # skip invalid logs
                if log is None:
                    continue
                obj = res.data.logs[i].address
                print(obj)  # contains address of Tornado X

                if (
                    res.data.logs[i].topics[0]
                    == "0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196"
                ):
                    print("Deposit found")
                elif (
                    res.data.logs[i].topics[0]
                    == "0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931"
                ):
                    print("Withdrawal found")
                else:
                    print("EUHH")
                # print(dir(res.data.logs[0].topics), res.data.logs[0].topics)

                # Deposit
                # print("Here")
                # print("B0", log.body[0].val)  # leafIndex
                # print("B1", log.body[1].val)  # timestamp
                # print("I0", log.indexed[0].val)  # commitment (the only indexed param)

                # Withdrawal
                # print("B0", log.body[0].val)  # to
                # print("B1", log.body[1].val)  # nullifierHash
                # print("B2", log.body[2].val)  # fee
                # print("I0", log.indexed[0].val)  # relayer (the only indexed param)

            # return
        height = res.archive_height
        while height < res.next_block:
            print(f"waiting for chain to advance. Height is {height}")
            height = await client.get_height()
            time.sleep(1)

        query.from_block = res.next_block


asyncio.run(main())
