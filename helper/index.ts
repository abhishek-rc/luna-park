import { addEditableTags } from "@contentstack/utils";
import { Page } from "../typescript/pages";
import { FooterProps, HeaderProps } from "../typescript/layout";
import { getEntry, getEntryByUrl } from "../contentstack-sdk";

const liveEdit = process.env.CONTENTSTACK_LIVE_EDIT_TAGS === "true";

export const getHeaderRes = async (): Promise<HeaderProps> => {
    const response = (await getEntry({
        contentTypeUid: "header",
        referenceFieldPath: ["navigation_menu.page_reference"],
        jsonRtePath: ["notification_bar.announcement_text"],
    })) as HeaderProps[][];

    liveEdit && addEditableTags(response[0][0], "header", true);
    return response[0][0];
};

export const getFooterRes = async (): Promise<FooterProps> => {
    const response = (await getEntry({
        contentTypeUid: "footer",
        referenceFieldPath: undefined,
        jsonRtePath: ["copyright"],
    })) as FooterProps[][];
    liveEdit && addEditableTags(response[0][0], "footer", true);
    return response[0][0];
};

export const getAllEntries = async (): Promise<Page[]> => {
    const response = (await getEntry({
        contentTypeUid: "page",
        referenceFieldPath: undefined,
        jsonRtePath: undefined,
    })) as Page[][];
    liveEdit &&
        response[0].forEach((entry) => addEditableTags(entry, "page", true));
    return response[0];
};

export const getPageRes = async (entryUrl: string): Promise<Page> => {
    const response = (await getEntryByUrl({
        contentTypeUid: "page",
        entryUrl,
        referenceFieldPath: ["page_components"],
        jsonRtePath: [
            "page_components.section_with_buckets.buckets.description",
            "page_components.section_with_html_code.description",
        ],
    })) as Page[];
    liveEdit && addEditableTags(response[0], "page", true);
    return response[0];
};

// Generic content fetching functions
export const getContentByType = async (contentTypeUid: string): Promise<any[]> => {
    const response = (await getEntry({
        contentTypeUid,
        referenceFieldPath: undefined,
        jsonRtePath: undefined,
    })) as any[][];
    liveEdit &&
        response[0].forEach((entry) => addEditableTags(entry, contentTypeUid, true));
    return response[0];
};

export const getContentByUrl = async (contentTypeUid: string, entryUrl: string): Promise<any> => {
    const response = (await getEntryByUrl({
        contentTypeUid,
        entryUrl,
        referenceFieldPath: undefined,
        jsonRtePath: undefined,
    })) as any[];
    liveEdit && addEditableTags(response[0], contentTypeUid, true);
    return response[0];
};
