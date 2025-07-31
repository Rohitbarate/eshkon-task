# Contentful Page Builder

A powerful drag-and-drop page builder built for Contentful, featuring a fullscreen interface for editors to visually arrange components and a Next.js frontend for rendering the pages.

## 🎯 Key Features

- **Visual Page Builder**: Drag-and-drop interface for arranging page components
- **JSON Configuration**: Layout saved as JSON in Contentful for flexible rendering
- **Real-time Preview**: See changes instantly as you build
- **Component Library**: Pre-built components (Hero, Two Column, Image Grid)
- **Undo/Redo**: Full history tracking with undo/redo functionality
- **Auto-save**: Automatic saving to Contentful with visual feedback
- **Responsive Design**: Mobile-first approach with responsive components

## 🏗️ How It Works

### 1. JSON Configuration Storage

The page builder saves the layout configuration as JSON in Contentful:

```json
{
  "components": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0,
      "data": {
        "heading": "Welcome to Our Site",
        "subtitle": "Build beautiful pages with drag and drop",
        "ctaText": "Get Started",
        "ctaUrl": "#",
        "backgroundImage": {
          "sys": { "id": "image-id" },
          "url": "https://images.pexels.com/...",
          "title": "Hero Background"
        }
      }
    }
  ],
  "updatedAt": "2024-01-15T10:30:00Z",
  "version": "1.0"
}
```

### 2. Page Builder Interface (`/contentful-app`)

- **Component Palette**: Drag components from the left sidebar
- **Canvas Area**: Drop and arrange components
- **Live Preview**: See component previews as you build
- **Auto-save**: Changes saved automatically to Contentful
- **History**: Undo/redo functionality for all changes

### 3. Frontend Rendering (`/landing/[slug]`)

- Loads JSON configuration from Contentful
- Renders components in the specified order
- Fully responsive and SEO-optimized
- Falls back to default content if no configuration exists

### Installation

1. **Clone and install dependencies:**

```bash
git clone https://github.com/Rohitbarate/eshkon-task.git
cd eshkon-task
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Fill in your Contentful credentials:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_ENVIRONMENT=master
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

3. **Start development server:**

```bash
npm run dev
```

4. **Access the applications:**

- Homepage: http://localhost:3000
- Page Builder: http://localhost:3000/contentful-app
- Demo Pages: http://localhost:3000/landing/page-1

## 📋 Contentful Setup

Create the following content model in Contentful:

### Landing Page Content Type

- **API Identifier**: `landingPage`
- **Fields**:
  - `title` (Short text, required)
  - `slug` (Short text, required, unique)
  - `layoutConfig` (JSON object) - **This stores the page builder configuration**

### Component Content Types (Optional)

You can also create individual content types for each component:

#### Hero Block

- **API Identifier**: `heroBlock`
- **Fields**: `heading`, `subtitle`, `ctaText`, `ctaUrl`, `backgroundImage`

#### Two Column Block

- **API Identifier**: `twoColumnBlock`
- **Fields**: `leftHeading`, `leftSubtitle`, `leftCtaText`, `leftCtaUrl`, `rightImage`

#### Image Grid Block

- **API Identifier**: `imageGridBlock`
- **Fields**: `images` (Media, multiple files)

## 🔧 How JSON Saving Works

### In the Page Builder:

1. **User drags components** → Redux state updates
2. **Auto-save middleware triggers** → After 2 seconds of inactivity
3. **JSON configuration created** → From current component state
4. **Saved to Contentful** → Via App SDK or Management API
5. **Visual feedback shown** → "Saving..." → "Saved at [time]"

### Code Example (Middleware):

```typescript
// store/middleware/contentfulSaveMiddleware.ts
const layoutConfig = {
  components: state.layout.components,
  updatedAt: new Date().toISOString(),
  version: "1.0",
};

// Save to Contentful
await entry.fields.layoutConfig.setValue(layoutConfig);
```

## 🎨 How Landing Page Rendering Works

### Loading Configuration:

```typescript
// lib/layoutConfigLoader.ts
export async function loadLayoutConfig(slug: string) {
  // 1. Try loading from Contentful
  const contentfulConfig = await loadFromContentful(slug);

  // 2. Fall back to localStorage (demo)
  const localConfig = loadFromLocalStorage();

  // 3. Use default configuration
  return getDefaultLayoutConfig();
}
```

### Rendering Components:

```typescript
// app/landing/[slug]/page.tsx
const layoutConfig = await loadLayoutConfig(slug);

return (
  <main>
    {layoutConfig?.components
      .sort((a, b) => a.order - b.order)
      .map(renderComponent)}
  </main>
);
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

## 🚀 Deployment

1. **Build the project:**

```bash
npm run build
```

2. **Deploy to Vercel:**

```bash
vercel --prod
```

## 📁 Project Structure

```
├── app/
│   ├── contentful-app/          # Page builder interface
│   ├── landing/[slug]/          # Dynamic landing pages
│   └── page.tsx                 # Homepage
├── components/
│   ├── contentful-app/          # Page builder components
│   ├── landing/                 # Landing page components
│   └── layout/                  # Navigation and layout
├── store/
│   ├── slices/                  # Redux slices
│   └── middleware/              # Auto-save middleware
├── lib/
│   ├── contentful.ts            # Contentful client
│   └── layoutConfigLoader.ts    # JSON config loader
└── types/                       # TypeScript definitions
```

## 🔄 Data Flow

1. **Page Builder** → Creates/modifies components → **Redux Store**
2. **Auto-save Middleware** → Detects changes → **Saves JSON to Contentful**
3. **Landing Page** → Loads JSON config → **Renders components**

## 🎯 Key Files

- **JSON Saving**: `store/middleware/contentfulSaveMiddleware.ts`
- **JSON Loading**: `lib/layoutConfigLoader.ts`
- **Page Rendering**: `app/landing/[slug]/page.tsx`
- **Page Builder**: `components/contentful-app/PageBuilder.tsx`
