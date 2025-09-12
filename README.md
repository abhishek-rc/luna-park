# Luna Park + Contentstack

A modern Next.js 15 application integrated with Contentstack CMS, featuring React 19, TypeScript, and Tailwind CSS.

## Features

- **Next.js 15** with App Router
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Contentstack SDK** for headless CMS integration
- **Live Preview** support
- **Environment-based configuration**

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Contentstack account and stack

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your Contentstack credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Contentstack configuration:

```env
# Required - Basic Configuration
CONTENTSTACK_API_KEY=your_api_key_here
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
CONTENTSTACK_ENVIRONMENT=your_environment_here

# Optional - Advanced Configuration
CONTENTSTACK_BRANCH=main
CONTENTSTACK_REGION=us

# Live Preview Configuration (Optional)
CONTENTSTACK_LIVE_PREVIEW=true
CONTENTSTACK_PREVIEW_TOKEN=your_preview_token_here
CONTENTSTACK_PREVIEW_HOST=rest-preview.contentstack.com
CONTENTSTACK_APP_HOST=app.contentstack.com

# API Host Configuration (Optional)
CONTENTSTACK_API_HOST=api.contentstack.io

# Live Edit Tags (Optional)
CONTENTSTACK_LIVE_EDIT_TAGS=false
```

### 3. Get Contentstack Credentials

1. Log in to your [Contentstack dashboard](https://app.contentstack.com)
2. Create a new stack or use an existing one
3. Go to **Settings** > **Stack** to get your API Key
4. Go to **Settings** > **Tokens** to create a Delivery Token
5. Set your environment (e.g., "development", "production")

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
luna-park/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── contentstack-sdk/       # Contentstack SDK configuration
│   ├── index.ts           # Main SDK functions
│   └── utils.ts           # SDK utilities and initialization
├── helper/                 # Content fetching helpers
├── typescript/             # TypeScript type definitions
│   ├── action.ts          # Action and Image types
│   ├── component.ts       # Component types
│   ├── layout.ts          # Layout types
│   └── pages.ts           # Page types
├── next.config.ts         # Next.js configuration
└── env.example            # Environment variables example
```

## Contentstack SDK Usage

### Basic Content Fetching

```typescript
import { getEntry, getEntryByUrl } from '../contentstack-sdk';

// Fetch all entries from a content type
const pages = await getEntry({
  contentTypeUid: 'page',
  referenceFieldPath: undefined,
  jsonRtePath: undefined,
});

// Fetch a specific entry by URL
const page = await getEntryByUrl({
  contentTypeUid: 'page',
  entryUrl: '/about',
  referenceFieldPath: ['page_components'],
  jsonRtePath: ['page_components.section.description'],
});
```

### Using Helper Functions

```typescript
import { getPageRes, getContentByType, getContentByUrl } from '../helper';

// Fetch page content
const page = await getPageRes('/about');

// Fetch any content type
const products = await getContentByType('product');
const articles = await getContentByType('article');

// Fetch specific content by URL
const product = await getContentByUrl('product', '/laptop-pro');
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contentstack Features

### Live Preview
The application supports Contentstack's Live Preview feature, allowing content editors to see changes in real-time.

### Content Types
The application is configured to work with common content types:
- `page` - Website pages
- `product` - Product listings
- `article` - Articles and news
- `category` - Content categories
- `service` - Service offerings
- `header` - Site header
- `footer` - Site footer

### Rich Text Rendering
The SDK includes support for Contentstack's Rich Text Editor (RTE) with HTML rendering.

## Troubleshooting

### Common Issues

1. **"Please set your .env file" error**
   - Ensure all required environment variables are set in `.env.local`
   - Check that your API key and delivery token are correct

2. **No content displayed**
   - Verify your Contentstack stack has content
   - Check that content types match the expected structure
   - Ensure your delivery token has access to the content

3. **Live Preview not working**
   - Verify preview token and host configuration
   - Check that live preview is enabled in your stack settings

## Learn More

- [Contentstack Documentation](https://www.contentstack.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is licensed under the MIT License.