import { LayoutComponent } from '../types/contentful';

export interface LayoutConfig {
  components: LayoutComponent[];
  updatedAt: string;
  version: string;
  metadata?: {
    totalComponents: number;
    componentTypes: string[];
    lastModifiedBy: string;
  };
}

// 🔄 MAIN LOADING FUNCTION - This is where the magic happens!
export async function loadLayoutConfig(slug: string): Promise<LayoutConfig | null> {
  console.log(`🔍 Loading layout config for slug: ${slug}`);
  
  try {
    // Method 1: Try to load from Contentful (Production)
    if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.log('📡 Attempting to load from Contentful...');
      const contentfulConfig = await loadFromContentful(slug);
      if (contentfulConfig) {
        console.log('✅ Loaded layout config from Contentful:', contentfulConfig);
        return contentfulConfig;
      }
    }
    
    // Method 2: Try to load from localStorage (Demo/Development)
    if (typeof window !== 'undefined') {
      console.log('💾 Attempting to load from localStorage...');
      const localConfig = loadFromLocalStorage();
      if (localConfig) {
        console.log('✅ Loaded layout config from localStorage:', localConfig);
        return localConfig;
      }
    }
    
    // Method 3: Return default configuration
    console.log('🎯 Using default layout configuration');
    return getDefaultLayoutConfig();
    
  } catch (error) {
    console.error('❌ Error loading layout configuration:', error);
    return getDefaultLayoutConfig();
  }
}

// 📡 CONTENTFUL LOADING (Production)
async function loadFromContentful(slug: string): Promise<LayoutConfig | null> {
  try {
    const { contentfulClient, LANDING_PAGE_QUERY } = await import('./contentful');
    
    if (!contentfulClient) {
      console.log('⚠️ Contentful client not configured');
      return null;
    }
    
    const data = await contentfulClient.request(LANDING_PAGE_QUERY, { slug });
    const page = data.landingPageCollection.items[0];
    
    if (page && page.layoutConfig) {
      // Parse the JSON configuration stored in Contentful
      const config = JSON.parse(page.layoutConfig);
      console.log('📄 Parsed Contentful layout config:', config);
      return config;
    }
    
    console.log('📭 No layout config found in Contentful for slug:', slug);
    return null;
  } catch (error) {
    console.error('❌ Error loading from Contentful:', error);
    return null;
  }
}

// 💾 LOCALSTORAGE LOADING (Demo/Development)
function loadFromLocalStorage(): LayoutConfig | null {
  // Only run on client side
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem('contentful-layout-config');
    if (stored) {
      const config = JSON.parse(stored);
      console.log('📱 Parsed localStorage config:', config);
      return config;
    }
    console.log('📭 No config found in localStorage');
    return null;
  } catch (error) {
    console.error('❌ Error loading from localStorage:', error);
    return null;
  }
}

// 🎯 DEFAULT CONFIGURATION
function getDefaultLayoutConfig(): LayoutConfig {
  return {
    components: [
      {
        id: 'hero-default',
        type: 'hero',
        order: 0,
        data: {
          heading: 'Welcome to Our Landing Page',
          subtitle: 'This is a beautiful landing page built with our drag-and-drop page builder. Experience the power of visual content creation.',
          ctaText: 'Get Started',
          ctaUrl: '#',
          backgroundImage: {
            sys: { id: 'hero-bg' },
            title: 'Hero Background',
            url: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1200',
            width: 1200,
            height: 600,
            contentType: 'image/jpeg',
          },
        },
      },
      {
        id: 'two-col-default',
        type: 'twoColumn',
        order: 1,
        data: {
          leftHeading: 'Build Beautiful Pages',
          leftSubtitle: 'Our intuitive page builder makes it easy to create stunning landing pages without any coding knowledge. Drag, drop, and publish in minutes.',
          leftCtaText: 'Learn More',
          leftCtaUrl: '#',
          rightImage: {
            sys: { id: 'feature-img' },
            title: 'Feature Image',
            url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
            width: 800,
            height: 600,
            contentType: 'image/jpeg',
          },
        },
      },
      {
        id: 'grid-default',
        type: 'imageGrid',
        order: 2,
        data: {
          images: [
            {
              sys: { id: 'grid-1' },
              title: 'Gallery Image 1',
              url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
            {
              sys: { id: 'grid-2' },
              title: 'Gallery Image 2',
              url: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
            {
              sys: { id: 'grid-3' },
              title: 'Gallery Image 3',
              url: 'https://images.pexels.com/photos/3184321/pexels-photo-3184321.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
            {
              sys: { id: 'grid-4' },
              title: 'Gallery Image 4',
              url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
              width: 400,
              height: 400,
              contentType: 'image/jpeg',
            },
          ],
        },
      },
    ],
    updatedAt: new Date().toISOString(),
    version: '1.0',
    metadata: {
      totalComponents: 3,
      componentTypes: ['hero', 'twoColumn', 'imageGrid'],
      lastModifiedBy: 'default-config',
    },
  };
}

// 💾 CLIENT-SIDE SAVE FUNCTION
export function saveLayoutConfigToLocalStorage(config: LayoutConfig): void {
  if (typeof window !== 'undefined') {
    try {
      const configWithTimestamp = {
        ...config,
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('contentful-layout-config', JSON.stringify(configWithTimestamp));
      console.log('💾 Layout config saved to localStorage:', configWithTimestamp);
      
      // Also save a backup with timestamp
      const backupKey = `contentful-layout-backup-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(configWithTimestamp));
      
      // Clean up old backups (keep only last 5)
      cleanupOldBackups();
      
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }
}

// 🧹 CLEANUP OLD BACKUPS
function cleanupOldBackups(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('contentful-layout-backup-'))
      .sort()
      .reverse(); // Most recent first
    
    // Keep only the 5 most recent backups
    const keysToDelete = backupKeys.slice(5);
    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ Cleaned up old backup:', key);
    });
  } catch (error) {
    console.error('❌ Error cleaning up backups:', error);
  }
}

// 📊 UTILITY FUNCTIONS
export function getLayoutConfigStats(config: LayoutConfig | null) {
  if (!config) return null;
  
  return {
    totalComponents: config.components.length,
    componentTypes: [...new Set(config.components.map(c => c.type))],
    lastUpdated: config.updatedAt,
    version: config.version,
  };
}

export function validateLayoutConfig(config: any): config is LayoutConfig {
  return (
    config &&
    typeof config === 'object' &&
    Array.isArray(config.components) &&
    typeof config.updatedAt === 'string' &&
    typeof config.version === 'string'
  );
}