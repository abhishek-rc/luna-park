// Simple Shopify API client using fetch directly

// Environment configuration

const envConfig = {
    SHOPIFY_SHOP_DOMAIN: process.env.SHOPIFY_SHOP_DOMAIN,
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION || "2024-01",
};

// Validate Shopify configuration
const validateShopifyConfig = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!envConfig.SHOPIFY_SHOP_DOMAIN) {
        errors.push("SHOPIFY_SHOP_DOMAIN is required");
    } else if (envConfig.SHOPIFY_SHOP_DOMAIN.includes('your-') || envConfig.SHOPIFY_SHOP_DOMAIN.includes('your_')) {
        errors.push("SHOPIFY_SHOP_DOMAIN contains placeholder value - please set your actual shop domain");
    }

    if (!envConfig.SHOPIFY_ACCESS_TOKEN) {
        errors.push("SHOPIFY_ACCESS_TOKEN is required");
    } else if (envConfig.SHOPIFY_ACCESS_TOKEN.includes('your-') || envConfig.SHOPIFY_ACCESS_TOKEN.includes('your_')) {
        errors.push("SHOPIFY_ACCESS_TOKEN contains placeholder value - please set your actual admin API token");
    }

    if (!envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
        errors.push("SHOPIFY_STOREFRONT_ACCESS_TOKEN is required");
    } else if (envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN.includes('your-') || envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN.includes('your_')) {
        errors.push("SHOPIFY_STOREFRONT_ACCESS_TOKEN contains placeholder value - please set your actual storefront token");
    }

    if (errors.length > 0) {
        console.error("❌ Shopify configuration errors:");
        errors.forEach((error) => console.error(`  - ${error}`));
        console.error(
            "Please set the required environment variables in your .env.local file"
        );
        console.error(
            "Run 'node scripts/check-shopify-config.js' to validate your configuration"
        );
        return false;
    }

    if (warnings.length > 0) {
        console.warn("⚠️ Shopify configuration warnings:");
        warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }

    console.log("✅ Shopify configuration is valid");
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

// GraphQL client for Shopify Storefront API
const shopifyGraphQLClient = {
    // Execute GraphQL query
    query: async (query: string, variables: any = {}) => {
        if (!isShopifyConfigured) {
            throw new Error(
                "Shopify is not properly configured. Please check your environment variables."
            );
        }

        console.log("GraphQL Query:", query);
        console.log("GraphQL Variables:", variables);
        console.log("Shopify Domain:", envConfig.SHOPIFY_SHOP_DOMAIN);
        console.log("API Version:", envConfig.SHOPIFY_API_VERSION);

        const response = await fetch(
            `https://${envConfig.SHOPIFY_SHOP_DOMAIN}/api/${envConfig.SHOPIFY_API_VERSION}/graphql.json`,
            {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": envConfig.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
                }),
                body: JSON.stringify({
                    query,
                    variables,
                }),
            }
        );

        console.log("GraphQL Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Shopify Storefront API Error:", {
                status: response.status,
                statusText: response.statusText,
                body: errorText,
            });
            throw new Error(
                `Failed to execute GraphQL query: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("GraphQL Response Data:", JSON.stringify(data, null, 2));

        if (data.errors) {
            console.error("GraphQL Errors:", data.errors);
            throw new Error(
                `GraphQL errors: ${data.errors.map((e: any) => e.message).join(", ")}`
            );
        }

        return data.data;
    },
};

// GraphQL client for Shopify Admin API
const shopifyAdminGraphQLClient = {
    // Execute GraphQL query using Admin API
    query: async (query: string, variables: any = {}) => {
        if (!isShopifyConfigured) {
            throw new Error(
                "Shopify is not properly configured. Please check your environment variables."
            );
        }

        console.log("Admin GraphQL Query:", query);
        console.log("Admin GraphQL Variables:", variables);
        console.log("Shopify Domain:", envConfig.SHOPIFY_SHOP_DOMAIN);
        console.log("API Version:", envConfig.SHOPIFY_API_VERSION);

            const response = await fetch(
                `https://${envConfig.SHOPIFY_SHOP_DOMAIN}/admin/api/2025-07/graphql.json`,
            {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": envConfig.SHOPIFY_ACCESS_TOKEN ?? "",
                }),
                body: JSON.stringify({
                    query,
                    variables,
                }),
            }
        );

        console.log("Admin GraphQL Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Shopify Admin API Error:", {
                status: response.status,
                statusText: response.statusText,
                body: errorText,
            });
            throw new Error(
                `Failed to execute Admin GraphQL query: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("Admin GraphQL Response Data:", JSON.stringify(data, null, 2));

        if (data.errors) {
            console.error("Admin GraphQL Errors:", data.errors);
            throw new Error(
                `Admin GraphQL errors: ${data.errors.map((e: any) => e.message).join(", ")}`
            );
        }

        return data.data;
    },
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
    status: "ACTIVE" | "ARCHIVED" | "DRAFT";
    availableForSale: boolean;
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

// Product management functions
export class ShopifyProductService {
    /**
     * Get metafields for a specific product using Storefront API
     */
    private static async getProductMetafields(productId: string): Promise<any[]> {
        if (!isShopifyConfigured) {
            return [];
        }

        try {
            const query = `
                query getProductMetafields($id: ID!) {
                    product(id: $id) {
                        metafields(identifiers: [
                            {namespace: "custom", key: "product_key"}
                        ]) {
                            id
                            namespace
                            key
                            value
                            type
                        }
                    }
                }
            `;

            const data = await shopifyGraphQLClient.query(query, {
                id: productId.startsWith("gid://")
                    ? productId
                    : `gid://shopify/Product/${productId}`,
            });

            return data?.product?.metafields || [];
        } catch (error) {
            console.error("Error fetching metafields:", error);
            return [];
        }
    }

    /**
     * Get all products from Shopify
     */
    static async getAllProducts(): Promise<ShopifyProduct[]> {
        if (!isShopifyConfigured) {
            console.warn("Shopify is not configured, returning empty products array");
            return [];
        }

        try {
            console.log("Fetching products from Shopify Storefront API...");

            const query = `
                query getProducts($first: Int!) {
                    products(first: $first) {
                        edges {
                            node {
                                id
                                title
                                handle
                                description
                                productType
                                vendor
                                tags
                                createdAt
                                updatedAt
                                publishedAt
                                availableForSale
                                images(first: 10) {
                                    edges {
                                        node {
                                            id
                                            url
                                            altText
                                            width
                                            height
                                        }
                                    }
                                }
                                variants(first: 100) {
                                    edges {
                                        node {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            compareAtPrice {
                                                amount
                                                currencyCode
                                            }
                                            sku
                                            availableForSale
                                            quantityAvailable
                                            selectedOptions {
                                                name
                                                value
                                            }
                                        }
                                    }
                                }
                                options {
                                    id
                                    name
                                    values
                                }
                            }
                        }
                    }
                }
            `;

            const data = await shopifyGraphQLClient.query(query, { first: 50 });
            const products =
                data?.products?.edges?.map((edge: any) => edge.node) || [];
            console.log(`Found ${products.length} products from Storefront API`);

            const mappedProducts = await Promise.all(
                products.map(async (product: any) => {
                    console.log("Mapping product:", product.id, product.title);
                    const mappedProduct = this.mapShopifyProduct(product);

                    // Fetch metafields for this product
                    const metafields = await this.getProductMetafields(product.id);
                    mappedProduct.metafields = metafields.map((mf: any) => ({
                        id: mf.id,
                        namespace: mf.namespace,
                        key: mf.key,
                        value: mf.value,
                        type: mf.type,
                    }));

                    return mappedProduct;
                })
            );

            console.log(`Mapped ${mappedProducts.length} products successfully`);
            return mappedProducts;
        } catch (error) {
            console.error("Error fetching products from Shopify:", error);
            throw new Error(
                `Failed to fetch products from Shopify: ${error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }






    /**
     * Create a real order using Shopify Admin API
     */
    static async createOrder(
        orderData: {
            email: string;
            firstName: string;
            lastName: string;
            lineItems: Array<{
                variantId: string;
                quantity: number;
                price?: number;
            }>;
            totalPrice: number;
            financialStatus?: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'voided' | 'partially_refunded';
            fulfillmentStatus?: 'fulfilled' | 'null' | 'partial' | 'restocked';
            note?: string;
        }
    ): Promise<{
        success: boolean;
        orderId?: string;
        orderNumber?: string;
        error?: string;
    }> {
        if (!isShopifyConfigured) {
            return {
                success: false,
                error: "Shopify is not properly configured",
            };
        }

        try {
            // Use Admin API to create a real order
            const orderMutation = `
                mutation orderCreate($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
                    orderCreate(order: $order, options: $options) {
                        order {
                            id
                            name
                            email
                            totalPriceSet {
                                shopMoney {
                                    amount
                                    currencyCode
                                }
                            }
                            lineItems(first: 10) {
                                nodes {
                                    id
                                    title
                                    quantity
                                    variant {
                                        id
                                        title
                                    }
                                }
                            }
                            createdAt
                            updatedAt
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `;

            // Prepare line items for the order
            const orderLineItems = orderData.lineItems.map(item => ({
                variantId: `gid://shopify/ProductVariant/${item.variantId}`,
                quantity: item.quantity
            }));

            const orderInput = {
                lineItems: orderLineItems,
                email: orderData.email,
                ...(orderData.note && { note: orderData.note })
            };

            const optionsInput = {
                // Minimal options - only include valid fields
            };

            console.log('Creating order with input:', JSON.stringify(orderInput, null, 2));

            const orderData_result = await shopifyAdminGraphQLClient.query(orderMutation, {
                order: orderInput,
                options: optionsInput
            });

            if (orderData_result?.orderCreate?.userErrors?.length > 0) {
                const errors = orderData_result.orderCreate.userErrors;
                return {
                    success: false,
                    error: errors.map((e: any) => e.message).join(", "),
                };
            }

            const order = orderData_result?.orderCreate?.order;
            if (order) {
                console.log('Order created successfully:', order);
                return {
                    success: true,
                    orderId: order.id,
                    orderNumber: order.name // Shopify uses 'name' field for order number
                };
            }

            return {
                success: false,
                error: "Failed to create order - no order returned",
            };
        } catch (error) {
            console.error("Error creating order:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to create order",
            };
        }
    }

    /**
     * Create checkout using Storefront API (using cartCreate as fallback)
     */
    static async createCheckout(
        lineItems: Array<{ variantId: string; quantity: number }>
    ): Promise<{
        success: boolean;
        checkoutUrl?: string;
        error?: string;
    }> {
        if (!isShopifyConfigured) {
            return {
                success: false,
                error: "Shopify is not properly configured",
            };
        }

        try {
            // Try cartCreate first (newer API), then fallback to checkoutCreate
            let hasCartCreate = true;
            let hasCheckoutCreate = true;
            
            // Try cartCreate first (newer API) if available
            if (hasCartCreate) {
                const cartMutation = `
                mutation cartCreate($input: CartInput!) {
                    cartCreate(input: $input) {
                        cart {
                            id
                            checkoutUrl
                            lines(first: 10) {
                                edges {
                                    node {
                                        id
                                        quantity
                                        merchandise {
                                            ... on ProductVariant {
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
                            }
                            cost {
                                totalAmount {
                                    amount
                                    currencyCode
                                }
                                subtotalAmount {
                                    amount
                                    currencyCode
                                }
                                totalTaxAmount {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `;

                const cartData = await shopifyGraphQLClient.query(cartMutation, {
                    input: {
                        lines: lineItems.map((item) => ({
                            merchandiseId: `gid://shopify/ProductVariant/${item.variantId}`,
                            quantity: item.quantity,
                        })),
                    },
                });

                if (cartData?.cartCreate?.userErrors?.length > 0) {
                    const errors = cartData.cartCreate.userErrors;
                    return {
                        success: false,
                        error: errors.map((e: any) => e.message).join(", "),
                    };
                }

                const cart = cartData?.cartCreate?.cart;
                if (cart && cart.checkoutUrl) {
                    return {
                        success: true,
                        checkoutUrl: cart.checkoutUrl,
                    };
                }
            }

            // Fallback: Try the old checkoutCreate mutation if available
            if (hasCheckoutCreate) {
                const checkoutMutation = `
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

                const checkoutData = await shopifyGraphQLClient.query(checkoutMutation, {
                    input: {
                        lineItems: lineItems.map((item) => ({
                            variantId: `gid://shopify/ProductVariant/${item.variantId}`,
                            quantity: item.quantity,
                        })),
                    },
                });

                if (checkoutData?.checkoutCreate?.checkoutUserErrors?.length > 0) {
                    const errors = checkoutData.checkoutCreate.checkoutUserErrors;
                    return {
                        success: false,
                        error: errors.map((e: any) => e.message).join(", "),
                    };
                }

                const checkout = checkoutData?.checkoutCreate?.checkout;
                if (checkout) {
                    return {
                        success: true,
                        checkoutUrl: checkout.webUrl,
                    };
                }
            }

            // If neither mutation worked, return an error
            return {
                success: false,
                error: "Failed to create checkout or cart",
            };
        } catch (error) {
            console.error("Error creating checkout:", error);
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Failed to create checkout",
            };
        }
    }

    /**
     * Create a cart with line items
     */
    static async createCart(
        lineItems: Array<{
            variantId: string;
            quantity: number;
        }>
    ): Promise<{
        id: string;
        totalQuantity: number;
        cost: {
            totalAmount: {
                amount: string;
                currencyCode: string;
            };
        };
        lines: {
            edges: Array<{
                node: {
                    id: string;
                    quantity: number;
                    merchandise: {
                        id: string;
                        title: string;
                        price: {
                            amount: string;
                            currencyCode: string;
                        };
                        product: {
                            id: string;
                            title: string;
                        };
                    };
                };
            }>;
        };
    }> {
        const mutation = `
            mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                    cart {
                        id
                        totalQuantity
                        cost {
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        lines(first: 10) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                id
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            input: {
                lines: lineItems.map((item) => ({
                    merchandiseId: `gid://shopify/ProductVariant/${item.variantId}`,
                    quantity: item.quantity,
                })),
            },
        };

        console.log("Cart create variables:", JSON.stringify(variables, null, 2));
        console.log("Line items being sent:", lineItems);

        const response = await shopifyGraphQLClient.query(mutation, variables);

        console.log("Cart create response:", JSON.stringify(response, null, 2));

        if (response?.cartCreate?.userErrors?.length > 0) {
            console.error(
                "Cart creation user errors:",
                response.cartCreate.userErrors
            );
            throw new Error(
                `Cart creation failed: ${response.cartCreate.userErrors
                    .map((e: any) => e.message)
                    .join(", ")}`
            );
        }

        const cart = response?.cartCreate?.cart;
        console.log("Created cart:", cart);

        if (!cart) {
            console.error("No cart returned from response:", response);
            throw new Error("Failed to create cart - no cart returned from response");
        }

        return cart;
    }

    /**
     * Add items to an existing cart
     */
    static async addToCart(
        cartId: string,
        lineItems: Array<{
            variantId: string;
            quantity: number;
        }>
    ): Promise<{
        id: string;
        totalQuantity: number;
        cost: {
            totalAmount: {
                amount: string;
                currencyCode: string;
            };
        };
        lines: {
            edges: Array<{
                node: {
                    id: string;
                    quantity: number;
                    merchandise: {
                        id: string;
                        title: string;
                        price: {
                            amount: string;
                            currencyCode: string;
                        };
                        product: {
                            id: string;
                            title: string;
                        };
                    };
                };
            }>;
        };
    }> {
        const mutation = `
            mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
                cartLinesAdd(cartId: $cartId, lines: $lines) {
                    cart {
                        id
                        totalQuantity
                        cost {
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        lines(first: 10) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                id
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            cartId: `gid://shopify/Cart/${cartId}`,
            lines: lineItems.map((item) => ({
                merchandiseId: `gid://shopify/ProductVariant/${item.variantId}`,
                quantity: item.quantity,
            })),
        };

        const response = await shopifyGraphQLClient.query(mutation, variables);

        console.log("Add to cart response:", JSON.stringify(response, null, 2));

        if (response?.cartLinesAdd?.userErrors?.length > 0) {
            console.error(
                "Add to cart user errors:",
                response.cartLinesAdd.userErrors
            );
            throw new Error(
                `Add to cart failed: ${response.cartLinesAdd.userErrors
                    .map((e: any) => e.message)
                    .join(", ")}`
            );
        }

        const cart = response?.cartLinesAdd?.cart;
        console.log("Updated cart after add:", cart);

        if (!cart) {
            console.error("No cart returned from add to cart response:", response);
            throw new Error(
                "Failed to add items to cart - no cart returned from response"
            );
        }

        return cart;
    }

    /**
     * Update cart line items
     */
    static async updateCartLines(
        cartId: string,
        lineItems: Array<{
            id: string;
            quantity: number;
        }>
    ): Promise<{
        id: string;
        totalQuantity: number;
        cost: {
            totalAmount: {
                amount: string;
                currencyCode: string;
            };
        };
        lines: {
            edges: Array<{
                node: {
                    id: string;
                    quantity: number;
                    merchandise: {
                        id: string;
                        title: string;
                        price: {
                            amount: string;
                            currencyCode: string;
                        };
                        product: {
                            id: string;
                            title: string;
                        };
                    };
                };
            }>;
        };
    }> {
        const mutation = `
            mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
                cartLinesUpdate(cartId: $cartId, lines: $lines) {
                    cart {
                        id
                        totalQuantity
                        cost {
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        lines(first: 10) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                id
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            cartId: `gid://shopify/Cart/${cartId}`,
            lines: lineItems.map((item) => ({
                id: `gid://shopify/CartLine/${item.id}`,
                quantity: item.quantity,
            })),
        };

        const response = await shopifyGraphQLClient.query(mutation, variables);

        if (response?.cartLinesUpdate?.userErrors?.length > 0) {
            throw new Error(
                `Update cart failed: ${response.cartLinesUpdate.userErrors
                    .map((e: any) => e.message)
                    .join(", ")}`
            );
        }

        const cart = response?.cartLinesUpdate?.cart;
        if (!cart) {
            throw new Error("Failed to update cart");
        }

        return cart;
    }

    /**
     * Remove items from cart
     */
    static async removeFromCart(
        cartId: string,
        lineItemIds: string[]
    ): Promise<{
        id: string;
        totalQuantity: number;
        cost: {
            totalAmount: {
                amount: string;
                currencyCode: string;
            };
        };
        lines: {
            edges: Array<{
                node: {
                    id: string;
                    quantity: number;
                    merchandise: {
                        id: string;
                        title: string;
                        price: {
                            amount: string;
                            currencyCode: string;
                        };
                        product: {
                            id: string;
                            title: string;
                        };
                    };
                };
            }>;
        };
    }> {
        const mutation = `
            mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
                cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                    cart {
                        id
                        totalQuantity
                        cost {
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        lines(first: 10) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                id
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            cartId: `gid://shopify/Cart/${cartId}`,
            lineIds: lineItemIds.map((id) => `gid://shopify/CartLine/${id}`),
        };

        const response = await shopifyGraphQLClient.query(mutation, variables);

        if (response?.cartLinesRemove?.userErrors?.length > 0) {
            throw new Error(
                `Remove from cart failed: ${response.cartLinesRemove.userErrors
                    .map((e: any) => e.message)
                    .join(", ")}`
            );
        }

        const cart = response?.cartLinesRemove?.cart;
        if (!cart) {
            throw new Error("Failed to remove items from cart");
        }

        return cart;
    }

    /**
     * Get cart by ID
     */
    static async getCart(cartId: string): Promise<{
        id: string;
        totalQuantity: number;
        cost: {
            totalAmount: {
                amount: string;
                currencyCode: string;
            };
        };
        lines: {
            edges: Array<{
                node: {
                    id: string;
                    quantity: number;
                    merchandise: {
                        id: string;
                        title: string;
                        price: {
                            amount: string;
                            currencyCode: string;
                        };
                        product: {
                            id: string;
                            title: string;
                        };
                    };
                };
            }>;
        };
    } | null> {
        const query = `
            query getCart($id: ID!) {
                cart(id: $id) {
                    id
                    totalQuantity
                    cost {
                        totalAmount {
                            amount
                            currencyCode
                        }
                    }
                    lines(first: 10) {
                        edges {
                            node {
                                id
                                quantity
                                merchandise {
                                    ... on ProductVariant {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        image {
                                            url
                                        }
                                        product {
                                            id
                                            title
                                            images(first: 1) {
                                                edges {
                                                    node {
                                                        url
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            id: `gid://shopify/Cart/${cartId}`,
        };

        const response = await shopifyGraphQLClient.query(query, variables);
        return response?.cart || null;
    }

    /**
     * Map Shopify Storefront API product to our interface
     */
    private static mapShopifyProduct(product: any): ShopifyProduct {
        // Extract ID from GID format (gid://shopify/Product/123456)
        const extractId = (gid: string) => {
            if (gid.startsWith("gid://")) {
                return gid.split("/").pop() || gid;
            }
            return gid;
        };

        return {
            id: extractId(product.id),
            title: product.title,
            handle: product.handle,
            description: product.description || "",
            productType: product.productType || "",
            vendor: product.vendor || "",
            tags: product.tags || [],
            status: product.availableForSale ? "ACTIVE" : "DRAFT", // Use availableForSale to determine status
            availableForSale: product.availableForSale || false,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            publishedAt: product.publishedAt,
            images:
                product.images?.edges?.map((edge: any) => ({
                    id: extractId(edge.node.id),
                    url: edge.node.url,
                    altText: edge.node.altText || "",
                    width: edge.node.width || 0,
                    height: edge.node.height || 0,
                })) || [],
            variants:
                product.variants?.edges?.map((edge: any) => ({
                    id: extractId(edge.node.id),
                    productId: extractId(product.id),
                    title: edge.node.title,
                    price: edge.node.price?.amount || "0",
                    compareAtPrice: edge.node.compareAtPrice?.amount,
                    sku: edge.node.sku,
                    inventoryQuantity: edge.node.quantityAvailable || 0,
                    availableForSale: edge.node.availableForSale,
                    selectedOptions:
                        edge.node.selectedOptions?.map((option: any) => ({
                            name: option.name,
                            value: option.value,
                        })) || [],
                })) || [],
            options:
                product.options?.map((option: any) => ({
                    id: option.id,
                    name: option.name,
                    values: option.values || [],
                })) || [],
            metafields: [], // Will be populated separately
        };
    }
}

export { shopifyGraphQLClient };
