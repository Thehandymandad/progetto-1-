export interface CatalogProduct {
    id: string;
    price?: string | number;
    priceValue?: number;
    priceCurrencyCode?: string;
    [key: string]: unknown;
}
export interface Purchase {
    id: string;
    [key: string]: unknown;
}
