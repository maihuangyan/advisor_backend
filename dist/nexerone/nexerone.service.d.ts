import { BaseService } from "src/_base/base.service";
export declare class NexeroneService extends BaseService {
    getNexoroneToken(): Promise<string>;
    verifyToken(token: string): Promise<any>;
    verifyClient(token: string): Promise<any>;
    verifyClientToken(token: string): Promise<any>;
    loadClientInfo(email: string): Promise<any>;
    loadClientBalancesWithProfitLoss(email: string): Promise<any>;
    updateClientFees(email: string, data: any): Promise<any>;
    sendPushNotification(user: string, title: string, message: string): Promise<any>;
    loadClientsWithProfileAndBalances(emailList: Array<string>): Promise<any>;
    loadClientsProfiles(emailList: Array<string>): Promise<any>;
    loadClientsBalances(emailList: Array<string>): Promise<any>;
    loadClientBalances(email: string): Promise<any>;
    loadClientTransactions(account_number: string, start: number, end: number): Promise<any>;
    loadClientCardTransactions(card_number: string, card_currency: string, year: string, month: string): Promise<any>;
    loadCurrencyRates(): Promise<any>;
    sendEmail(email: string, subject: string, content: string): Promise<any>;
}
