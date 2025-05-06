import { Schema, model, Document } from 'mongoose';

export enum ENTITY_TYPE {
    MERCHANT = "merchant",
    RIDER = "rider"
}
export enum OPERATION_TYPE {
    BEFORE = "before",
    AFTER = "after"
}

export interface IWalletTransactionLogsInput {
    orderId: string;
    type: OPERATION_TYPE; //before or after
    riderId?: string;
    action: ENTITY_TYPE;
    balanceBefore: number;
    balanceAfter: number;
    storeId?: string;
    bookingId?: string;
    holdAmountBefore?: number;
    holdAmountAfter?: number;
    earningAmountBefore?: number;
    earningAmountAfter?: number;
    appId?: string;
}

export interface IWalletTransactionLogsOutput extends Document {
    orderId: string;
    type: OPERATION_TYPE; //before or after
    riderId: string;
    entity: ENTITY_TYPE;
    balanceBefore: number;
    balanceAfter: number;
    storeId: string;
    appId: string;
    bookingId: string;
    holdAmountBefore: number;
    holdAmountAfter: number;
    earningAmountBefore: number;
    earningAmountAfter: number;
    createdAt: Date;
    updatedAt: Date;
}

const WalletTransactionLogsSchema = new Schema<IWalletTransactionLogsOutput>(
    {
        orderId: { type: String, required: true },
        type: { type: String, enum: Object.values(OPERATION_TYPE), required: true },
        entity: { type: String, enum: Object.values(ENTITY_TYPE), required: true },
        balanceBefore: { type: Number },
        balanceAfter: { type: Number },
        holdAmountBefore: { type: Number },
        holdAmountAfter: { type: Number },
        earningAmountBefore: { type: Number },
        earningAmountAfter: { type: Number },
        storeId: { type: String },
        riderId: { type: String },
        bookingId: { type: String },
        appId: { type: String }
    },
    {
        timestamps: true
    }
);

WalletTransactionLogsSchema.index({ storeId: 1 });
WalletTransactionLogsSchema.index({ riderId: 1 });

export const WalletTransactionLogsModel = model<IWalletTransactionLogsOutput>('WalletTransactionLogs', WalletTransactionLogsSchema);
