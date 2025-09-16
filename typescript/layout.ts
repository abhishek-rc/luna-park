import { Image } from "./action";
import { Component } from "./component";

type AdditionalParam = {
    title: {};
    copyright: string;
    announcement_text: string;
    label: {};
    url: string;
}

type EntryData = {
    title: string;
    url: string;
    $: AdditionalParam;
}

type Announcement = {
    show_announcement: boolean;
    announcement_text: string;
    $: AdditionalParam;
}

type PageRef = {
    title: string;
    url: string;
    $: AdditionalParam;
}

type Share = {
    link: Links;
    icon: Image;
}

type Social = {
    social_share: [Share];
}

type Navigation = {
    link: [Links];
}


export type HeaderProps = {
    locale: string;
    logo: Image;
    navigation_menu: [List]
    notification_bar: Announcement;
    title: string;
    uid: string;
    social: Social;
    navigation: Navigation;
    copyright: string;
    $: AdditionalParam;
}

export type Entry = [
    entry: EntryData
]

type List = {
    label?: string;
    page_reference: [PageRef];
    $: {};
    href?: string;
}

export type NavLinks = {
    label?: string;
}

export type Links = {
    label?: string;
    title: string;
    href: string;
    $: AdditionalParam;
}

export type PageProps = {
    locale: string;
    page_components: Component[];
    uid: string;
    url: string;
    title: string;
    seo: {};
}

export type FooterProps = {
    logo: Image;
    title: string;
    social: Social;
    navigation: Navigation;
    copyright: string;
    locale: string,
    navigation_menu: [List];
    notification_bar: Announcement;
    uid: string;
    $: AdditionalParam;
}

export type ChilderenProps = {
    props: {};
    type: Function;
}

// Luna Park Header Types
export type LunaParkHeaderEntry = {
    uid: string;
    _version: number;
    locale: string;
    ACL: {};
    _in_progress: boolean;
    call_to_action_buttons: {
        button_url: {
            title: string;
            href: string;
        };
    };
    created_at: string;
    created_by: string;
    primary_navigation: Array<{
        navigation_url: {
            title: string;
            href: string;
        };
        _metadata: {
            uid: string;
        };
        has_dropdown: boolean;
        dropdown_items: Array<{
            dropdown_url: {
                title: string;
                href: string;
            };
            _metadata: {
                uid: string;
            };
        }>;
    }>;
    site_logo: {
        uid: string;
        _version: number;
        parent_uid: string;
        title: string;
        created_by: string;
        updated_by: string;
        created_at: string;
        updated_at: string;
        content_type: string;
        file_size: string;
        filename: string;
        ACL: {};
        is_dir: boolean;
        tags: any[];
        publish_details: {
            time: string;
            user: string;
            environment: string;
            locale: string;
        };
        url: string;
    };
    tags: any[];
    title: string;
    updated_at: string;
    updated_by: string;
    user_actions: {
        show_login: boolean;
        login_url: {
            title: string;
            href: string;
        };
        show_signup: boolean;
        signup_url: {
            title: string;
            href: string;
        };
        show_cart: boolean;
        cart_icon: {
            uid: string;
            _version: number;
            parent_uid: string;
            title: string;
            created_by: string;
            updated_by: string;
            created_at: string;
            updated_at: string;
            content_type: string;
            file_size: string;
            filename: string;
            ACL: {};
            is_dir: boolean;
            tags: any[];
            publish_details: {
                time: string;
                user: string;
                environment: string;
                locale: string;
            };
            url: string;
        };
    };
    publish_details: {
        time: string;
        user: string;
        environment: string;
        locale: string;
    };
};

export type LunaParkHeaderResponse = {
    entries: LunaParkHeaderEntry[];
};

// Homepage Types
export type HomepageEventCard = {
    event_image: {
        uid: string;
        _version: number;
        parent_uid: string;
        title: string;
        created_by: string;
        updated_by: string;
        created_at: string;
        updated_at: string;
        content_type: string;
        file_size: string;
        filename: string;
        ACL: {};
        is_dir: boolean;
        tags: any[];
        publish_details: {
            time: string;
            user: string;
            environment: string;
            locale: string;
        };
        url: string;
    };
    event_heading: string;
    event_description: string;
    event_card_cta: {
        title: string;
        href: string;
    };
    _metadata: {
        uid: string;
    };
};

export type HomepageEventGroup = {
    event_card: HomepageEventCard[];
};

export type HomepageHeroSection = {
    hero_cover: {
        uid: string;
        _version: number;
        parent_uid: string;
        title: string;
        created_by: string;
        updated_by: string;
        created_at: string;
        updated_at: string;
        content_type: string;
        file_size: string;
        filename: string;
        ACL: {};
        is_dir: boolean;
        tags: any[];
        publish_details: {
            time: string;
            user: string;
            environment: string;
            locale: string;
        };
        url: string;
    };
    hero_cta: {
        title: string;
        href: string;
    };
};

export type HomepageMemoryCard = {
    memory_card_image: {
        uid: string;
        _version: number;
        parent_uid: string;
        title: string;
        created_by: string;
        updated_by: string;
        created_at: string;
        updated_at: string;
        content_type: string;
        file_size: string;
        filename: string;
        ACL: {};
        is_dir: boolean;
        tags: any[];
        publish_details: {
            time: string;
            user: string;
            environment: string;
            locale: string;
        };
        url: string;
    };
    memory_card_title: string;
    _metadata: {
        uid: string;
    };
};

export type HomepageMemoryPartyGroup = {
    memory_booking_card: HomepageMemoryCard[];
};

export type HomepageTicketCard = {
    card_title: string;
    card_image: {
        uid: string;
        _version: number;
        parent_uid: string;
        title: string;
        created_by: string;
        updated_by: string;
        created_at: string;
        updated_at: string;
        content_type: string;
        file_size: string;
        filename: string;
        ACL: {};
        is_dir: boolean;
        tags: any[];
        publish_details: {
            time: string;
            user: string;
            environment: string;
            locale: string;
        };
        url: string;
    };
    card_cta: {
        title: string;
        href: string;
    };
    _metadata: {
        uid: string;
    };
    card_key: string;
};

export type HomepageTicketGroup = {
    tab_id: number;
    tab_name: string;
    ticketbooking_cards: HomepageTicketCard[];
    _metadata: {
        uid: string;
    };
};

export type HomepageEntry = {
    uid: string;
    _version: number;
    locale: string;
    ACL: {};
    _in_progress: boolean;
    created_at: string;
    created_by: string;
    event_group: HomepageEventGroup;
    hero_section: HomepageHeroSection;
    memory_party_group: HomepageMemoryPartyGroup;
    tags: any[];
    ticketbooking_group: HomepageTicketGroup[];
    title: string;
    updated_at: string;
    updated_by: string;
    publish_details: {
        time: string;
        user: string;
        environment: string;
        locale: string;
    };
};

export type HomepageResponse = HomepageEntry[];

// Shopify Integration Types
export type ShopifyProduct = {
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
};

export type ShopifyCheckout = {
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
};

// Enhanced HomepageTicketCard with Shopify integration
export type EnhancedHomepageTicketCard = HomepageTicketCard & {
    shopifyProduct?: ShopifyProduct;
    shopifyVariants?: ShopifyProduct['variants'];
    isAvailable?: boolean;
    price?: string;
    compareAtPrice?: string;
    inventoryQuantity?: number;
};