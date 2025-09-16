import {
    HomepageTicketCard,
    EnhancedHomepageTicketCard,
    ShopifyProduct
} from '../typescript/layout';
import {
    ProductMappingService as ShopifyProductMappingService
} from '../shopify-sdk';
import {
    getProductKey,
    productMatchesCardKey,
    getDefaultVariant,
    isProductAvailable,
    formatPrice
} from '../shopify-sdk/utils';

/**
 * Service to handle mapping between Contentstack and Shopify products
 */
export class ProductMappingService {
    /**
     * Enhance Contentstack ticket cards with Shopify product data
     */
    static async enhanceTicketCardsWithShopifyData(
        ticketCards: HomepageTicketCard[]
    ): Promise<EnhancedHomepageTicketCard[]> {
        try {
            // Get all unique card keys from Contentstack
            const cardKeys = ticketCards
                .map(card => card.card_key)
                .filter((key, index, array) => array.indexOf(key) === index); // Remove duplicates

            // Fetch all Shopify products using API route
            const response = await fetch('/api/shopify/products');
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            const allShopifyProducts: ShopifyProduct[] = data.products || [];

            // Create a map of card_key to Shopify products
            const cardKeyToProductsMap = new Map<string, ShopifyProduct[]>();

            for (const cardKey of cardKeys) {
                const matchingProducts = allShopifyProducts.filter(product =>
                    productMatchesCardKey(product, cardKey)
                );
                cardKeyToProductsMap.set(cardKey, matchingProducts);
            }

            // Enhance each ticket card with Shopify data
            const enhancedCards: EnhancedHomepageTicketCard[] = ticketCards.map(card => {
                const shopifyProducts = cardKeyToProductsMap.get(card.card_key) || [];
                const primaryProduct = shopifyProducts[0]; // Use the first matching product as primary

                if (!primaryProduct) {
                    return {
                        ...card,
                        isAvailable: false,
                    };
                }

                const defaultVariant = getDefaultVariant(primaryProduct);
                const isAvailable = isProductAvailable(primaryProduct);

                return {
                    ...card,
                    shopifyProduct: primaryProduct,
                    shopifyVariants: primaryProduct.variants,
                    isAvailable,
                    price: defaultVariant?.price,
                    compareAtPrice: defaultVariant?.compareAtPrice,
                    inventoryQuantity: defaultVariant?.inventoryQuantity || 0,
                };
            });

            return enhancedCards;
        } catch (error) {
            console.error('Error enhancing ticket cards with Shopify data:', error);
            // Return original cards if enhancement fails
            return ticketCards.map(card => ({
                ...card,
                isAvailable: false,
            }));
        }
    }

    /**
     * Get Shopify products for a specific card key
     */
    static async getShopifyProductsForCardKey(cardKey: string): Promise<ShopifyProduct[]> {
        try {
            const response = await fetch(`/api/shopify/products/by-key?cardKey=${encodeURIComponent(cardKey)}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data.products || [];
        } catch (error) {
            console.error(`Error fetching Shopify products for card key ${cardKey}:`, error);
            return [];
        }
    }

    /**
     * Get all mapped products (Contentstack + Shopify)
     */
    static async getAllMappedProducts(): Promise<Array<{
        contentstackCard: HomepageTicketCard;
        shopifyProducts: ShopifyProduct[];
    }>> {
        try {
            // This would typically involve getting all Contentstack cards
            // For now, return empty array as this requires more complex implementation
            return [];
        } catch (error) {
            console.error('Error getting all mapped products:', error);
            return [];
        }
    }

    /**
     * Sync product data between Contentstack and Shopify
     */
    static async syncProductData(
        contentstackCards: HomepageTicketCard[],
        shopifyProducts: ShopifyProduct[]
    ): Promise<{
        synced: number;
        missing: number;
        errors: string[];
    }> {
        const result = {
            synced: 0,
            missing: 0,
            errors: [] as string[],
        };

        try {
            for (const card of contentstackCards) {
                const matchingProducts = shopifyProducts.filter(product =>
                    productMatchesCardKey(product, card.card_key)
                );

                if (matchingProducts.length === 0) {
                    result.missing++;
                    result.errors.push(`No Shopify product found for card_key: ${card.card_key}`);
                } else {
                    result.synced++;
                }
            }

            return result;
        } catch (error) {
            console.error('Error syncing product data:', error);
            result.errors.push(`Sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return result;
        }
    }

    /**
     * Validate product mapping
     */
    static validateProductMapping(
        contentstackCards: HomepageTicketCard[],
        shopifyProducts: ShopifyProduct[]
    ): {
        isValid: boolean;
        issues: Array<{
            type: 'missing' | 'duplicate' | 'mismatch';
            cardKey: string;
            message: string;
        }>;
    } {
        const issues: Array<{
            type: 'missing' | 'duplicate' | 'mismatch';
            cardKey: string;
            message: string;
        }> = [];

        // Check for missing Shopify products
        for (const card of contentstackCards) {
            const matchingProducts = shopifyProducts.filter(product =>
                productMatchesCardKey(product, card.card_key)
            );

            if (matchingProducts.length === 0) {
                issues.push({
                    type: 'missing',
                    cardKey: card.card_key,
                    message: `No Shopify product found for card_key: ${card.card_key}`,
                });
            } else if (matchingProducts.length > 1) {
                issues.push({
                    type: 'duplicate',
                    cardKey: card.card_key,
                    message: `Multiple Shopify products found for card_key: ${card.card_key} (${matchingProducts.length} products)`,
                });
            }
        }

        // Check for orphaned Shopify products (products with product_key not in Contentstack)
        const contentstackCardKeys = new Set(contentstackCards.map(card => card.card_key));
        for (const product of shopifyProducts) {
            const productKey = getProductKey(product);
            if (productKey && !contentstackCardKeys.has(productKey)) {
                issues.push({
                    type: 'mismatch',
                    cardKey: productKey,
                    message: `Shopify product with product_key ${productKey} not found in Contentstack`,
                });
            }
        }

        return {
            isValid: issues.length === 0,
            issues,
        };
    }

    /**
     * Get product statistics
     */
    static getProductStatistics(
        contentstackCards: HomepageTicketCard[],
        shopifyProducts: ShopifyProduct[]
    ): {
        contentstack: {
            total: number;
            withCardKey: number;
            withoutCardKey: number;
        };
        shopify: {
            total: number;
            withProductKey: number;
            withoutProductKey: number;
            active: number;
            draft: number;
            archived: number;
        };
        mapping: {
            mapped: number;
            unmapped: number;
            duplicateMappings: number;
        };
    } {
        const contentstackWithCardKey = contentstackCards.filter(card => card.card_key).length;
        const contentstackWithoutCardKey = contentstackCards.length - contentstackWithCardKey;

        const shopifyWithProductKey = shopifyProducts.filter(product => getProductKey(product)).length;
        const shopifyWithoutProductKey = shopifyProducts.length - shopifyWithProductKey;
        const shopifyActive = shopifyProducts.filter(product => product.status === 'ACTIVE').length;
        const shopifyDraft = shopifyProducts.filter(product => product.status === 'DRAFT').length;
        const shopifyArchived = shopifyProducts.filter(product => product.status === 'ARCHIVED').length;

        const contentstackCardKeys = new Set(contentstackCards.map(card => card.card_key));
        const mapped = shopifyProducts.filter(product => {
            const productKey = getProductKey(product);
            return productKey && contentstackCardKeys.has(productKey);
        }).length;

        const unmapped = contentstackCards.length - mapped;

        // Count duplicate mappings
        const cardKeyCounts = new Map<string, number>();
        for (const product of shopifyProducts) {
            const productKey = getProductKey(product);
            if (productKey) {
                cardKeyCounts.set(productKey, (cardKeyCounts.get(productKey) || 0) + 1);
            }
        }
        const duplicateMappings = Array.from(cardKeyCounts.values()).filter(count => count > 1).length;

        return {
            contentstack: {
                total: contentstackCards.length,
                withCardKey: contentstackWithCardKey,
                withoutCardKey: contentstackWithoutCardKey,
            },
            shopify: {
                total: shopifyProducts.length,
                withProductKey: shopifyWithProductKey,
                withoutProductKey: shopifyWithoutProductKey,
                active: shopifyActive,
                draft: shopifyDraft,
                archived: shopifyArchived,
            },
            mapping: {
                mapped,
                unmapped,
                duplicateMappings,
            },
        };
    }
}
