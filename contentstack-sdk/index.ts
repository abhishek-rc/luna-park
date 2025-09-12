import * as Utils from "@contentstack/utils";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import {
    customHostUrl,
    initializeContentStackSdk,
    isValidCustomHostUrl,
} from "./utils";

type GetEntry = {
    contentTypeUid: string;
    referenceFieldPath: string[] | undefined;
    jsonRtePath: string[] | undefined;
};

type GetEntryByUrl = {
    entryUrl: string | undefined;
    contentTypeUid: string;
    referenceFieldPath: string[] | undefined;
    jsonRtePath: string[] | undefined;
};

const envConfig = {
    CONTENTSTACK_API_HOST: process.env.CONTENTSTACK_API_HOST || "api.contentstack.io",
    CONTENTSTACK_LIVE_PREVIEW: process.env.CONTENTSTACK_LIVE_PREVIEW || "false",
    CONTENTSTACK_APP_HOST: process.env.CONTENTSTACK_APP_HOST || "app.contentstack.com",
};

let customHostBaseUrl = envConfig.CONTENTSTACK_API_HOST as string;

customHostBaseUrl = customHostBaseUrl ? customHostUrl(customHostBaseUrl) : '';

// SDK initialization
const Stack = initializeContentStackSdk();

// Set host URL only for custom host or non prod base URL's
if (!!customHostBaseUrl && isValidCustomHostUrl(customHostBaseUrl)) {
    Stack.setHost(customHostBaseUrl);
}

// Setting LP if enabled
if (envConfig.CONTENTSTACK_LIVE_PREVIEW === "true") {
    try {
        // Ensure Stack has live_preview configuration
        if (Stack.live_preview) {
            ContentstackLivePreview.init({
                stackSdk: Stack,
                clientUrlParams: {
                    host: envConfig.CONTENTSTACK_APP_HOST,
                },
                ssr: false,
            });
            console.log('Live Preview initialized successfully');
        } else {
            console.warn('Live Preview is enabled but Stack is not configured with live_preview settings');
        }
    } catch (err) {
        console.error('Live Preview initialization error:', err);
    }
} else {
    console.log('Live Preview is disabled');
}

export const { onEntryChange } = ContentstackLivePreview;

const renderOption = {
    span: (node: any, next: any) => next(node.children),
};

/**
 * Fetches all the entries from specific content-type
 * @param {* content-type uid} contentTypeUid
 * @param {* reference field name} referenceFieldPath
 * @param {* Json RTE path} jsonRtePath
 */
export const getEntry = ({
    contentTypeUid,
    referenceFieldPath,
    jsonRtePath,
}: GetEntry) => {
    return new Promise((resolve, reject) => {
        const query = Stack.ContentType(contentTypeUid).Query();
        if (referenceFieldPath) query.includeReference(referenceFieldPath);
        query
            .toJSON()
            .find()
            .then(
                (result) => {
                    jsonRtePath &&
                        Utils.jsonToHTML({
                            entry: result,
                            paths: jsonRtePath,
                            renderOption,
                        });
                    resolve(result);
                },
                (error) => {
                    reject(error);
                }
            );
    });
};

/**
 * Fetches specific entry from a content-type
 * @param {* content-type uid} contentTypeUid
 * @param {* url for entry to be fetched} entryUrl
 * @param {* reference field name} referenceFieldPath
 * @param {* Json RTE path} jsonRtePath
 * @returns
 */
export const getEntryByUrl = ({
    contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
}: GetEntryByUrl) => {
    return new Promise((resolve, reject) => {
        const blogQuery = Stack.ContentType(contentTypeUid).Query();
        if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
        blogQuery.toJSON();
        const data = blogQuery.where("url", `${entryUrl}`).find();
        data.then(
            (result) => {
                jsonRtePath &&
                    Utils.jsonToHTML({
                        entry: result,
                        paths: jsonRtePath,
                        renderOption,
                    });
                resolve(result[0]);
            },
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
};
