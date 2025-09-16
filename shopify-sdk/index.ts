// Simple Shopify API client using fetch directly

// Environment configuration
const envConfig = {
    SHOPIFY_SHOP_DOMAIN: process.env.SHOPIFY_SHOP_DOMAIN || '',
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN || '',
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
    SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION || '2024-10',
};

// Validate Shopify configuration
const validateShopifyConfig = () => {
    const errors = [];
    
    if (!envConfig.SHOPIFY_SHOP_DOMAIN) {
        errors.push('SHOPIFY_SHOP_DOMAIN is required');
    }
    
    if (!envConfig.SHOPIFY_ACCESS_TOKEN) {
        errors.push('SHOPIFY_ACCESS_TOKEN is required');
    }
    
    if (!envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
        errors.push('SHOPIFY_STOREFRONT_ACCESS_TOKEN is required');
    }
    
    if (errors.length > 0) {
        console.error('❌ Shopify configuration errors:');
        errors.forEach(error => console.error(`  - ${error}`));
        console.error('Please set the required environment variables in your .env.local file');
        return false;
    }
    
    console.log('✅ Shopify configuration is valid');
    return true;
};

// Check if configuration is valid
const isShopifyConfigured = validateShopifyConfig();

// Export configuration status for debugging
export const getShopifyConfigStatus = () => {
    return {
        isConfigured: isShopifyConfigured,
        hasShopDomain: !!envConfig.SHOPIFY_SHOP_DOMAIN,
        hasAccessToken: !!envConfig.SHOPIFY_ACCESS_TOKEN,
        hasStorefrontToken: !!envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        apiVersion: envConfig.SHOPIFY_API_VERSION,
        shopDomain: envConfig.SHOPIFY_SHOP_DOMAIN,
    };
};

// Test Shopify connection
export const testShopifyConnection = async () => {
    if (!isShopifyConfigured) {
        return {
            success: false,
            error: 'Shopify is not properly configured',
            details: getShopifyConfigStatus(),
        };
    }

    try {
        console.log('Testing Shopify connection...');
        const response = await shopifyClient.getProducts();
        return {
            success: true,
            message: `Successfully connected to Shopify. Found ${response.products?.length || 0} products.`,
            productCount: response.products?.length || 0,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: getShopifyConfigStatus(),
        };
    }
};

// REST API client for Shopify Admin API
const shopifyClient = {
    // Get all products
    getProducts: async () => {
        if (!isShopifyConfigured) {
            throw new Error('Shopify is not properly configured. Please check your environment variables.');
        }

        const response = await fetch(`https://${envConfig.SHOPIFY_SHOP_DOMAIN}/admin/api/${envConfig.SHOPIFY_API_VERSION}/products.json`, {
            headers: {
                'X-Shopify-Access-Token': envConfig.SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shopify API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },

    // Get product by ID
    getProduct: async (productId: string) => {
        if (!isShopifyConfigured) {
            throw new Error('Shopify is not properly configured. Please check your environment variables.');
        }

        const response = await fetch(`https://${envConfig.SHOPIFY_SHOP_DOMAIN}/admin/api/${envConfig.SHOPIFY_API_VERSION}/products/${productId}.json`, {
            headers: {
                'X-Shopify-Access-Token': envConfig.SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shopify API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },

    // Search products
    searchProducts: async (query: string) => {
        if (!isShopifyConfigured) {
            throw new Error('Shopify is not properly configured. Please check your environment variables.');
        }

        const response = await fetch(`https://${envConfig.SHOPIFY_SHOP_DOMAIN}/admin/api/${envConfig.SHOPIFY_API_VERSION}/products.json?title=${encodeURIComponent(query)}`, {
            headers: {
                'X-Shopify-Access-Token': envConfig.SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shopify API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Failed to search products: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },

    // Create checkout (using Storefront API)
    createCheckout: async (lineItems: Array<{ variantId: string; quantity: number }>) => {
        if (!isShopifyConfigured) {
            throw new Error('Shopify is not properly configured. Please check your environment variables.');
        }

        const mutation = `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        webUrl
                        lineItems(first: 10) {
                            edges {
                                node {
                                    id
                                    title
                                    quantity
                                    variant {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        product {
                                            id
                                            title
                                            handle
                                        }
                                    }
                                }
                            }
                        }
                        totalPrice {
                            amount
                            currencyCode
                        }
                        subtotalPrice {
                            amount
                            currencyCode
                        }
                        totalTax {
                            amount
                            currencyCode
                        }
                    }
                    checkoutUserErrors {
                        field
                        message
                    }
                }
            }
        `;

        const response = await fetch(`https://${envConfig.SHOPIFY_SHOP_DOMAIN}/api/${envConfig.SHOPIFY_API_VERSION}/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    input: {
                        lineItems: lineItems.map(item => ({
                            variantId: `gid://shopify/ProductVariant/${item.variantId}`,
                            quantity: item.quantity,
                        })),
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shopify Storefront API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Failed to create checkout: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },
};

// Helper function to get product metafields
const getProductMetafields = async (productId: string) => {
    if (!isShopifyConfigured) {
        console.warn('Shopify is not configured, returning empty metafields');
        return [];
    }

    try {
        const response = await fetch(`https://${envConfig.SHOPIFY_SHOP_DOMAIN}/admin/api/${envConfig.SHOPIFY_API_VERSION}/products/${productId}/metafields.json`, {
            headers: {
                'X-Shopify-Access-Token': envConfig.SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn(`Failed to fetch metafields for product ${productId}: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        return data.metafields || [];
    } catch (error) {
        console.error('Error fetching metafields:', error);
        return [];
    }
};

// Types for Shopify products
export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    productType: string;
    vendor: string;
    tags: string[];
    status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    images: {
        id: string;
        url: string;
        altText: string;
        width: number;
        height: number;
    }[];
    variants: {
        id: string;
        title: string;
        price: string;
        compareAtPrice?: string;
        sku?: string;
        inventoryQuantity: number;
        availableForSale: boolean;
        selectedOptions: {
            name: string;
            value: string;
        }[];
    }[];
    options: {
        id: string;
        name: string;
        values: string[];
    }[];
    metafields: {
        id: string;
        namespace: string;
        key: string;
        value: string;
        type: string;
    }[];
}

export interface ShopifyProductVariant {
    id: string;
    productId: string;
    title: string;
    price: string;
    compareAtPrice?: string;
    sku?: string;
    inventoryQuantity: number;
    availableForSale: boolean;
    selectedOptions: {
        name: string;
        value: string;
    }[];
}

export interface ShopifyCheckout {
    id: string;
    webUrl: string;
    lineItems: {
        id: string;
        title: string;
        quantity: number;
        variant: {
            id: string;
            title: string;
            price: string;
            product: {
                id: string;
                title: string;
                handle: string;
            };
        };
    }[];
    totalPrice: {
        amount: string;
        currencyCode: string;
    };
    subtotalPrice: {
        amount: string;
        currencyCode: string;
    };
    totalTax: {
        amount: string;
        currencyCode: string;
    };
    shippingAddress?: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        province: string;
        country: string;
        zip: string;
        phone?: string;
    };
    billingAddress?: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        province: string;
        country: string;
        zip: string;
        phone?: string;
    };
    email?: string;
    phone?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

// Product management functions
export class ShopifyProductService {
    /**
     * Get all products from Shopify
     */
    static async getAllProducts(): Promise<ShopifyProduct[]> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, returning empty products array');
            return [];
        }

        try {
            console.log('Fetching products from Shopify...');
            const response = await shopifyClient.getProducts();
            console.log(`Found ${response.products?.length || 0} products`);
            
            const products = await Promise.all(
                response.products.map(async (product: any) => {
                    const metafields = await getProductMetafields(product.id);
                    return this.mapShopifyProduct(product, metafields);
                })
            );
            return products;
        } catch (error) {
            console.error('Error fetching products from Shopify:', error);
            throw new Error(`Failed to fetch products from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get product by ID
     */
    static async getProductById(productId: string): Promise<ShopifyProduct | null> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, returning null');
            return null;
        }

        try {
            const response = await shopifyClient.getProduct(productId);
            const metafields = await getProductMetafields(productId);
            return this.mapShopifyProduct(response.product, metafields);
        } catch (error) {
            console.error('Error fetching product from Shopify:', error);
            return null;
        }
    }

    /**
     * Get product by handle
     */
    static async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, returning null');
            return null;
        }

        try {
            const response = await shopifyClient.searchProducts(handle);
            if (response.products.length > 0) {
                const product = response.products[0];
                const metafields = await getProductMetafields(product.id);
                return this.mapShopifyProduct(product, metafields);
            }
            return null;
        } catch (error) {
            console.error('Error fetching product by handle from Shopify:', error);
            return null;
        }
    }

    /**
     * Get products by product_key metafield (matching card_key from Contentstack)
     */
    static async getProductsByProductKey(productKey: string): Promise<ShopifyProduct[]> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, returning empty products array');
            return [];
        }

        try {
            // Get all products and filter by metafield
            const response = await shopifyClient.getProducts();
            const filteredProducts = [];

            for (const product of response.products) {
                const metafields = await getProductMetafields(product.id);
                const hasMatchingKey = metafields.some((mf: any) =>
                    mf.namespace === 'custom' &&
                    mf.key === 'product_key' &&
                    mf.value === productKey
                );

                if (hasMatchingKey) {
                    filteredProducts.push(this.mapShopifyProduct(product, metafields));
                }
            }

            return filteredProducts;
        } catch (error) {
            console.error('Error fetching products by product key from Shopify:', error);
            return [];
        }
    }

    /**
     * Search products by title or tags
     */
    static async searchProducts(query: string): Promise<ShopifyProduct[]> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, returning empty products array');
            return [];
        }

        try {
            const response = await shopifyClient.searchProducts(query);
            const products = await Promise.all(
                response.products.map(async (product: any) => {
                    const metafields = await getProductMetafields(product.id);
                    return this.mapShopifyProduct(product, metafields);
                })
            );
            return products;
        } catch (error) {
            console.error('Error searching products in Shopify:', error);
            return [];
        }
    }

    /**
     * Map Shopify REST API product to our interface
     */
    private static mapShopifyProduct(product: any, metafields: any[] = []): ShopifyProduct {
        return {
            id: product.id.toString(),
            title: product.title,
            handle: product.handle,
            description: product.body_html || '',
            productType: product.product_type || '',
            vendor: product.vendor || '',
            tags: product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : [],
            status: product.status.toUpperCase(),
            createdAt: product.created_at,
            updatedAt: product.updated_at,
            publishedAt: product.published_at,
            images: product.images ? product.images.map((img: any) => ({
                id: img.id.toString(),
                url: img.src,
                altText: img.alt || '',
                width: img.width || 0,
                height: img.height || 0,
            })) : [],
            variants: product.variants ? product.variants.map((variant: any) => ({
                id: variant.id.toString(),
                productId: product.id.toString(),
                title: variant.title,
                price: variant.price,
                compareAtPrice: variant.compare_at_price,
                sku: variant.sku,
                inventoryQuantity: variant.inventory_quantity || 0,
                availableForSale: variant.available,
                selectedOptions: variant.option1 ? [{
                    name: 'Option 1',
                    value: variant.option1
                }] : [],
            })) : [],
            options: product.options ? product.options.map((option: any) => ({
                id: option.id.toString(),
                name: option.name,
                values: option.values || [],
            })) : [],
            metafields: metafields.map((mf: any) => ({
                id: mf.id.toString(),
                namespace: mf.namespace,
                key: mf.key,
                value: mf.value,
                type: mf.type,
            })),
        };
    }

    /**
     * Map GraphQL product to our interface
     */
    private static mapGraphQLProduct(product: any): ShopifyProduct {
        return {
            id: product.id,
            title: product.title,
            handle: product.handle,
            description: product.description || '',
            productType: product.productType || '',
            vendor: product.vendor || '',
            tags: product.tags || [],
            status: product.status,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            publishedAt: product.publishedAt,
            images: product.images.edges.map((edge: any) => ({
                id: edge.node.id,
                url: edge.node.url,
                altText: edge.node.altText || '',
                width: edge.node.width || 0,
                height: edge.node.height || 0,
            })),
            variants: product.variants.edges.map((edge: any) => ({
                id: edge.node.id,
                productId: product.id,
                title: edge.node.title,
                price: edge.node.price,
                compareAtPrice: edge.node.compareAtPrice,
                sku: edge.node.sku,
                inventoryQuantity: edge.node.inventoryQuantity || 0,
                availableForSale: edge.node.availableForSale,
                selectedOptions: edge.node.selectedOptions || [],
            })),
            options: product.options || [],
            metafields: product.metafields.edges.map((edge: any) => ({
                id: edge.node.id,
                namespace: edge.node.namespace,
                key: edge.node.key,
                value: edge.node.value,
                type: edge.node.type,
            })),
        };
    }
}

// Checkout management functions
export class ShopifyCheckoutService {
    /**
     * Create a new checkout using GraphQL Storefront API
     */
    static async createCheckout(lineItems: Array<{
        variantId: string;
        quantity: number;
    }>): Promise<ShopifyCheckout | null> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, cannot create checkout');
            return null;
        }

        try {
            const response = await shopifyClient.createCheckout(lineItems);

            if (response.data.checkoutCreate.checkoutUserErrors.length > 0) {
                console.error('Checkout creation errors:', response.data.checkoutCreate.checkoutUserErrors);
                return null;
            }

            return this.mapGraphQLCheckout(response.data.checkoutCreate.checkout);
        } catch (error) {
            console.error('Error creating checkout in Shopify:', error);
            return null;
        }
    }

    /**
     * Get checkout by ID using GraphQL Storefront API
     */
    static async getCheckout(checkoutId: string): Promise<ShopifyCheckout | null> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, cannot get checkout');
            return null;
        }

        try {
            const query = `
                query getCheckout($id: ID!) {
                    node(id: $id) {
                        ... on Checkout {
                            id
                            webUrl
                            lineItems(first: 10) {
                                edges {
                                    node {
                                        id
                                        title
                                        quantity
                                        variant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                id
                                                title
                                                handle
                                            }
                                        }
                                    }
                                }
                            }
                            totalPrice {
                                amount
                                currencyCode
                            }
                            subtotalPrice {
                                amount
                                currencyCode
                            }
                            totalTax {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
            `;

            const response = await fetch(`https://${envConfig.SHOPIFY_SHOP_DOMAIN}/api/${envConfig.SHOPIFY_API_VERSION}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        id: `gid://shopify/Checkout/${checkoutId}`,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to get checkout: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                return null;
            }

            if (!data.data.node) {
                console.warn('Checkout not found');
        return null;
            }

            return this.mapGraphQLCheckout(data.data.node);
        } catch (error) {
            console.error('Error getting checkout from Shopify:', error);
            return null;
        }
    }

    /**
     * Update checkout line items using GraphQL Storefront API
     */
    static async updateCheckoutLineItems(
        checkoutId: string,
        lineItems: Array<{
            variantId: string;
            quantity: number;
        }>
    ): Promise<ShopifyCheckout | null> {
        if (!isShopifyConfigured) {
            console.warn('Shopify is not configured, cannot update checkout');
            return null;
        }

        try {
            const mutation = `
                mutation checkoutLineItemsUpdate($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
                    checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
                        checkout {
                            id
                            webUrl
                            lineItems(first: 10) {
                                edges {
                                    node {
                                        id
                                        title
                                        quantity
                                        variant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                id
                                                title
                                                handle
                                            }
                                        }
                                    }
                                }
                            }
                            totalPrice {
                                amount
                                currencyCode
                            }
                            subtotalPrice {
                                amount
                                currencyCode
                            }
                            totalTax {
                                amount
                                currencyCode
                            }
                        }
                        checkoutUserErrors {
                            field
                            message
                        }
                    }
                }
            `;

            const response = await fetch(`https://${envConfig.SHOPIFY_SHOP_DOMAIN}/api/${envConfig.SHOPIFY_API_VERSION}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    query: mutation,
                    variables: {
                        checkoutId: `gid://shopify/Checkout/${checkoutId}`,
                        lineItems: lineItems.map(item => ({
                            variantId: `gid://shopify/ProductVariant/${item.variantId}`,
                            quantity: item.quantity,
                        })),
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update checkout: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                return null;
            }

            if (data.data.checkoutLineItemsUpdate.checkoutUserErrors.length > 0) {
                console.error('Checkout update errors:', data.data.checkoutLineItemsUpdate.checkoutUserErrors);
        return null;
            }

            return this.mapGraphQLCheckout(data.data.checkoutLineItemsUpdate.checkout);
        } catch (error) {
            console.error('Error updating checkout in Shopify:', error);
            return null;
        }
    }

    /**
     * Map GraphQL checkout to our interface
     */
    private static mapGraphQLCheckout(checkout: any): ShopifyCheckout {
        return {
            id: checkout.id.replace('gid://shopify/Checkout/', ''),
            webUrl: checkout.webUrl,
            lineItems: checkout.lineItems.edges.map((edge: any) => ({
                id: edge.node.id,
                title: edge.node.title,
                quantity: edge.node.quantity,
                variant: {
                    id: edge.node.variant.id.replace('gid://shopify/ProductVariant/', ''),
                    title: edge.node.variant.title,
                    price: edge.node.variant.price.amount,
                    product: {
                        id: edge.node.variant.product.id.replace('gid://shopify/Product/', ''),
                        title: edge.node.variant.product.title,
                        handle: edge.node.variant.product.handle,
                    },
                },
            })),
            totalPrice: {
                amount: checkout.totalPrice.amount,
                currencyCode: checkout.totalPrice.currencyCode,
            },
            subtotalPrice: {
                amount: checkout.subtotalPrice.amount,
                currencyCode: checkout.subtotalPrice.currencyCode,
            },
            totalTax: {
                amount: checkout.totalTax.amount,
                currencyCode: checkout.totalTax.currencyCode,
            },
            shippingAddress: undefined, // Not available in basic checkout
            billingAddress: undefined, // Not available in basic checkout
            email: undefined, // Not available in basic checkout
            phone: undefined, // Not available in basic checkout
            note: undefined, // Not available in basic checkout
            createdAt: new Date().toISOString(), // Not available in GraphQL response
            updatedAt: new Date().toISOString(), // Not available in GraphQL response
        };
    }

    /**
     * Map Shopify REST API checkout to our interface
     */
    private static mapShopifyCheckout(checkout: any): ShopifyCheckout {
        return {
            id: checkout.id.toString(),
            webUrl: checkout.web_url,
            lineItems: checkout.line_items ? checkout.line_items.map((item: any) => ({
                id: item.id.toString(),
                title: item.title,
                quantity: item.quantity,
                variant: {
                    id: item.variant_id.toString(),
                    title: item.variant_title || '',
                    price: item.price,
                    product: {
                        id: item.product_id.toString(),
                        title: item.product_title || '',
                        handle: item.product_handle || '',
                    },
                },
            })) : [],
            totalPrice: {
                amount: checkout.total_price,
                currencyCode: checkout.currency,
            },
            subtotalPrice: {
                amount: checkout.subtotal_price,
                currencyCode: checkout.currency,
            },
            totalTax: {
                amount: checkout.total_tax,
                currencyCode: checkout.currency,
            },
            shippingAddress: checkout.shipping_address ? {
                firstName: checkout.shipping_address.first_name,
                lastName: checkout.shipping_address.last_name,
                address1: checkout.shipping_address.address1,
                address2: checkout.shipping_address.address2,
                city: checkout.shipping_address.city,
                province: checkout.shipping_address.province,
                country: checkout.shipping_address.country,
                zip: checkout.shipping_address.zip,
                phone: checkout.shipping_address.phone,
            } : undefined,
            billingAddress: checkout.billing_address ? {
                firstName: checkout.billing_address.first_name,
                lastName: checkout.billing_address.last_name,
                address1: checkout.billing_address.address1,
                address2: checkout.billing_address.address2,
                city: checkout.billing_address.city,
                province: checkout.billing_address.province,
                country: checkout.billing_address.country,
                zip: checkout.billing_address.zip,
                phone: checkout.billing_address.phone,
            } : undefined,
            email: checkout.email,
            phone: checkout.phone,
            note: checkout.note,
            createdAt: checkout.created_at,
            updatedAt: checkout.updated_at,
        };
    }
}

// Product mapping service for Contentstack integration
export class ProductMappingService {
    /**
     * Map Contentstack card_key to Shopify product_key
     */
    static async getShopifyProductsByCardKey(cardKey: string): Promise<ShopifyProduct[]> {
        return await ShopifyProductService.getProductsByProductKey(cardKey);
    }

    /**
     * Get all products with their mapping information
     */
    static async getAllMappedProducts(): Promise<Array<{
        contentstackCardKey: string;
        shopifyProducts: ShopifyProduct[];
    }>> {
        try {
            // This would typically involve getting all products and their metafields
            // For now, we'll return an empty array as this requires more complex implementation
            return [];
        } catch (error) {
            console.error('Error getting mapped products:', error);
            return [];
        }
    }
}

export { shopifyClient };
