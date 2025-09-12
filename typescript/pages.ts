import { Component } from "./component";
import { Image } from "./action";
import { Entry, HeaderProps, FooterProps } from "./layout";

type AdditionalParam = {
    title: string;
    title_h2: string;
    title_h3: string;
    description: string;
    banner_title: string;
    banner_description: string;
    designation: string;
    name: string;
    html_code: string;
    body: string;
    date: string;
    uid: string;
    copyright: string;
    announcement_text: string;
    label: {};
    url: string;
}

type Seo = {
    enable_search_indexing: boolean
}

export type Props = {
    page: Page;
    entryUrl: string;
    Component: any;
    entries: Entry;
    pageProps: PageProps;
    header: HeaderProps;
    footer: FooterProps;
}

export type Page = {
    page_components: Component[];
    uid: string;
    locale: string;
    url: string;
    seo: Seo;
    title: string;
}

export type PageProps = {
    page: Page;
}

export type Context = {
    resolvedUrl: string;
    setHeader: Function;
    write: Function;
    end: Function;
}

export type Pages = [
    page: Page
]

export type PageUrl = string;
