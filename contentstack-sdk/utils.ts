import { Config, Region, LivePreview, Stack } from "contentstack";

// Environment configuration
const {
    CONTENTSTACK_API_KEY = `bltbb970d066d1ad97a`,
    CONTENTSTACK_DELIVERY_TOKEN = `csacd927ebdc30eb4e93ee51dd`,
    CONTENTSTACK_ENVIRONMENT = `development`,
    CONTENTSTACK_BRANCH = `main`,
    CONTENTSTACK_REGION = `us`,
    CONTENTSTACK_PREVIEW_TOKEN = ``,
    CONTENTSTACK_PREVIEW_HOST = `rest-preview.contentstack.com`,
    CONTENTSTACK_APP_HOST = `app.contentstack.com`,
    CONTENTSTACK_LIVE_PREVIEW = `false`,
} = process.env;

console.log(CONTENTSTACK_API_KEY, CONTENTSTACK_DELIVERY_TOKEN, CONTENTSTACK_ENVIRONMENT, CONTENTSTACK_BRANCH, CONTENTSTACK_REGION, CONTENTSTACK_PREVIEW_TOKEN, CONTENTSTACK_PREVIEW_HOST, CONTENTSTACK_APP_HOST, CONTENTSTACK_LIVE_PREVIEW);

// Basic env validation
export const isBasicConfigValid = () => {
    return (
        !!CONTENTSTACK_API_KEY &&
        !!CONTENTSTACK_DELIVERY_TOKEN &&
        !!CONTENTSTACK_ENVIRONMENT
    );
};

// Live preview config validation
export const isLpConfigValid = () => {
    return (
        !!CONTENTSTACK_LIVE_PREVIEW &&
        !!CONTENTSTACK_PREVIEW_TOKEN &&
        !!CONTENTSTACK_PREVIEW_HOST &&
        !!CONTENTSTACK_APP_HOST
    );
};

// Set region
const setRegion = (): Region => {
    let region = "US" as keyof typeof Region;
    if (!!CONTENTSTACK_REGION && CONTENTSTACK_REGION !== "us") {
        region = CONTENTSTACK_REGION.toLocaleUpperCase().replace(
            "-",
            "_"
        ) as keyof typeof Region;
    }
    return Region[region];
};

// Set LivePreview config
const setLivePreviewConfig = (): LivePreview => {
    if (!isLpConfigValid())
        throw new Error("Your LP config is set to true. Please make you have set all required LP config in .env");
    return {
        preview_token: CONTENTSTACK_PREVIEW_TOKEN as string,
        enable: CONTENTSTACK_LIVE_PREVIEW === "true",
        host: CONTENTSTACK_PREVIEW_HOST as string,
    } as LivePreview;
};

// Contentstack SDK initialization
export const initializeContentStackSdk = (): Stack => {
    if (!isBasicConfigValid()) {
        console.error("❌ Invalid Contentstack configuration detected!");
        console.error("Please set your actual Contentstack credentials in .env.local file:");
        console.error("- CONTENTSTACK_API_KEY=your_actual_api_key");
        console.error("- CONTENTSTACK_DELIVERY_TOKEN=your_actual_delivery_token");
        console.error("- CONTENTSTACK_ENVIRONMENT=your_environment");
        throw new Error("Invalid Contentstack configuration. Please check your environment variables.");
    }

    console.log("✅ Initializing Contentstack SDK with valid credentials...");
    const stackConfig: Config = {
        api_key: CONTENTSTACK_API_KEY as string,
        delivery_token: CONTENTSTACK_DELIVERY_TOKEN as string,
        environment: CONTENTSTACK_ENVIRONMENT as string,
        region: setRegion(),
        branch: CONTENTSTACK_BRANCH,
    };
    if (CONTENTSTACK_LIVE_PREVIEW === "true") {
        stackConfig.live_preview = setLivePreviewConfig();
    }
    return Stack(stackConfig);
};

// API host URL
export const customHostUrl = (baseUrl: string): string => {
    return baseUrl.replace("api", "cdn");
};

// Generate prod API URLs
export const generateUrlBasedOnRegion = (): string[] => {
    return Object.keys(Region).map((region) => {
        if (region === "US") {
            return `cdn.contentstack.io`;
        }
        return `${region}-cdn.contentstack.com`;
    });
};

// Prod URL validation for custom host
export const isValidCustomHostUrl = (url = ''): boolean => {
    return url ? !generateUrlBasedOnRegion().includes(url) : false;
};
