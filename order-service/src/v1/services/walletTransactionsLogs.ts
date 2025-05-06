import { IWalletTransactionLogsInput, IWalletTransactionLogsOutput, WalletTransactionLogsModel } from "@logs/models/walletTransactionsLogs";

export async function saveWalletTransaction(payload: IWalletTransactionLogsInput): Promise<IWalletTransactionLogsOutput> {
    try {
        return await WalletTransactionLogsModel.create(payload)
    }
    catch (error) {
        console.error(error)
        throw new Error('Error while saving wallet transaction')
    }
}