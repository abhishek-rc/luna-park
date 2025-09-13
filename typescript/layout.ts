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