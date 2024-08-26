import assert from "assert";
import { 
  TestHelpers,
  TornadoCash_Eth_01_Deposit
} from "generated";
const { MockDb, TornadoCash_Eth_01 } = TestHelpers;

describe("TornadoCash_Eth_01 contract Deposit event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for TornadoCash_Eth_01 contract Deposit event
  const event = TornadoCash_Eth_01.Deposit.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("TornadoCash_Eth_01_Deposit is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await TornadoCash_Eth_01.Deposit.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualTornadoCash_Eth_01Deposit = mockDbUpdated.entities.TornadoCash_Eth_01_Deposit.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedTornadoCash_Eth_01Deposit: TornadoCash_Eth_01_Deposit = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      commitment: event.params.commitment,
      leafIndex: event.params.leafIndex,
      timestamp: event.params.timestamp,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualTornadoCash_Eth_01Deposit, expectedTornadoCash_Eth_01Deposit, "Actual TornadoCash_Eth_01Deposit should be the same as the expectedTornadoCash_Eth_01Deposit");
  });
});
