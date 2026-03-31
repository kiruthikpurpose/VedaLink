import { VedaLinkContract } from '../../../contracts/chaincode/src/VedaLinkContract';

// Simulated Ledger State
const mockState = new Map<string, Uint8Array>();

// Simulated Fabric Context
const mockContext = {
  stub: {
    async putState(key: string, value: Uint8Array): Promise<void> {
      mockState.set(key, value);
    },
    async getState(key: string): Promise<Uint8Array> {
      return mockState.get(key) || new Uint8Array();
    },
    async deleteState(key: string): Promise<void> {
      mockState.delete(key);
    }
  }
};

const contract = new VedaLinkContract();

export class MockLedgerClient {
  
  static async submitTransaction(name: string, ...args: any[]) {
      console.log(`[BLOCKCHAIN] Invoking Chaincode Function: ${name} with args:`, args);
      
      try {
          // Direct invocation of contract methods mapping
          if (name === 'CreateBatch') {
             return await contract.createBatch(mockContext, args[0], args[1], args[2], args[3]);
          } else if (name === 'TransferBatch') {
             return await contract.transferBatch(mockContext, args[0], args[1]);
          } else if (name === 'RecordGrade') {
             return await contract.recordGrade(mockContext, args[0], args[1], args[2]);
          }
          throw new Error('Transaction not implemented in mock');
      } catch (err) {
          console.error(`[BLOCKCHAIN] Transaction Failed: ${err}`);
          throw err;
      }
  }
  
  static async evaluateTransaction(name: string, ...args: any[]) {
      console.log(`[BLOCKCHAIN] Querying Chaincode Function: ${name} with args:`, args);
      if (name === 'GetBatch') {
        const state = await mockContext.stub.getState(args[0]);
        if (!state || state.length === 0) return null;
        return JSON.parse(state.toString());
      }
      throw new Error('Query not implemented in mock');
  }
}
