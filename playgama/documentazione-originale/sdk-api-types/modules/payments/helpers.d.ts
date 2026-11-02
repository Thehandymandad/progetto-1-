import type { AnyRecord } from '../../utils';
export declare function getPaymentsProductsPlatformData(payments: Array<AnyRecord & {
    id: string;
}> | undefined, platformId: string): AnyRecord[];
export declare function getPaymentsProductPlatformData(payments: Array<AnyRecord & {
    id: string;
}> | undefined, platformId: string, id: string): AnyRecord | null;
export declare function generatePaymentsTransactionId(id: string): string;
