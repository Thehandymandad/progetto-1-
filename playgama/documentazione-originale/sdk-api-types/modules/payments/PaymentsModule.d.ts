import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
import type { CatalogProduct, Purchase } from './types';
export interface PaymentsBridgeContract extends PlatformBridgeLike {
    isPaymentsSupported: boolean;
    paymentsPurchase(id: string, options?: unknown): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
}
declare class PaymentsModule extends ModuleBase<PaymentsBridgeContract> {
    get isSupported(): boolean;
    purchase(id: string, options?: unknown): Promise<Purchase>;
    getPurchases(): Promise<Purchase[]>;
    getCatalog(): Promise<CatalogProduct[]>;
    consumePurchase(id: string): Promise<Purchase>;
}
export default PaymentsModule;
