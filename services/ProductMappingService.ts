import {
    HomepageTicketCard,
    EnhancedHomepageTicketCard,
    ShopifyProduct
} from '../typescript/layout';
import {
    ShopifyProductService,
} from '../shopify-sdk';
import {
    getProductKey,
    getDefaultVariant,
    isProductAvailable,
    productMatchesCardKey,
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

            console.log('Contentstack card keys:', cardKeys);

            // Fetch all Shopify products
            const allShopifyProducts = await ShopifyProductService.getAllProducts();
            console.log(`Fetched ${allShopifyProducts.length} Shopify products`);

            // Log all product keys for debugging
            allShopifyProducts.forEach(product => {
                const productKey = getProductKey(product);
                console.log(`Product: ${product.title}, product_key: ${productKey}, availableForSale: ${product.availableForSale}`);
            });

            // Create a map of card_key to Shopify products
            const cardKeyToProductsMap = new Map<string, ShopifyProduct[]>();

            for (const cardKey of cardKeys) {
                const matchingProducts = allShopifyProducts.filter(product =>
                    productMatchesCardKey(product, cardKey)
                );
                console.log(`Card key "${cardKey}" matched ${matchingProducts.length} products`);
                cardKeyToProductsMap.set(cardKey, matchingProducts);
            }

            // Enhance each ticket card with Shopify data
            const enhancedCards: EnhancedHomepageTicketCard[] = ticketCards.map(card => {
                const shopifyProducts = cardKeyToProductsMap.get(card.card_key) || [];
                const primaryProduct = shopifyProducts[0]; // Use the first matching product as primary

                console.log(`Processing card: ${card.card_title}, card_key: ${card.card_key}`);
                console.log(`Found ${shopifyProducts.length} matching Shopify products`);

                if (!primaryProduct) {
                    console.log(`No Shopify product found for card_key: ${card.card_key}`);
                    return {
                        ...card,
                        isAvailable: false,
                    };
                }

                console.log(`Matching product: ${primaryProduct.title}, status: ${primaryProduct.status}, availableForSale: ${primaryProduct.availableForSale}`);
                console.log(`Product metafields:`, primaryProduct.metafields);

                const defaultVariant = getDefaultVariant(primaryProduct);
                console.log(`Default variant:`, defaultVariant);

                // Fix availability check - use availableForSale instead of status
                const isAvailable = primaryProduct.availableForSale &&
                    primaryProduct.variants.some(variant => variant.availableForSale);

                console.log(`Product is available: ${isAvailable}`);

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

            console.log('Enhanced cards:', enhancedCards);

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

}
