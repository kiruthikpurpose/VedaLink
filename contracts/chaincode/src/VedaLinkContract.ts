// Simulated Hyperledger Fabric Context and Contract
interface Context {
  stub: {
    putState(key: string, value: Uint8Array): Promise<void>;
    getState(key: string): Promise<Uint8Array>;
    deleteState(key: string): Promise<void>;
  }
}

export class VedaLinkContract {
  // 1. Create Batch Asset
  public async createBatch(ctx: Context, batchId: string, farmerId: string, cropType: string, quantityKg: number) {
    const exists = await this.assetExists(ctx, batchId);
    if (exists) {
        throw new Error(`The batch ${batchId} already exists`);
    }

    const asset = {
        ID: batchId,
        FarmerID: farmerId,
        CropType: cropType,
        QuantityKg: quantityKg,
        Status: 'CREATED',
        Owner: farmerId
    };

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(asset)));
    return JSON.stringify(asset);
  }

  // 2. Transfer Ownership
  public async transferBatch(ctx: Context, batchId: string, newOwnerId: string) {
    const assetString = await ctx.stub.getState(batchId);
    if (!assetString || assetString.length === 0) {
        throw new Error(`The batch ${batchId} does not exist`);
    }
    
    const asset = JSON.parse(assetString.toString());
    asset.Owner = newOwnerId;
    
    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(asset)));
    return JSON.stringify(asset);
  }

  // 3. Record Grade
  public async recordGrade(ctx: Context, batchId: string, grade: string, confidence: number) {
    const assetString = await ctx.stub.getState(batchId);
    if (!assetString || assetString.length === 0) {
        throw new Error(`The batch ${batchId} does not exist`);
    }
    const asset = JSON.parse(assetString.toString());
    asset.Grade = grade;
    asset.GradeConfidence = confidence;
    asset.Status = 'GRADED';

    await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(asset)));
    return JSON.stringify(asset);
  }

  // Utility
  private async assetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }
}
