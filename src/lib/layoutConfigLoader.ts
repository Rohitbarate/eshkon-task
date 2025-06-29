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
interface LandingPageData {
  landingPageCollection: {
    items: {
      layoutConfig: string | null;
    }[];
  };
}


export async function loadLayoutConfig(slug: string): Promise<LayoutConfig | null> {
  console.log(`Loading layout config for slug: ${slug}`);
  
  try {
    if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.log('Attempting to load from Contentful...');
      const contentfulConfig = await loadFromContentful(slug);
      if (contentfulConfig) {
        console.log('Loaded layout config from Contentful:', contentfulConfig);
        return contentfulConfig;
      }
    }
    
    if (typeof window !== 'undefined') {
      console.log('Attempting to load from localStorage...');
      const localConfig = loadFromLocalStorage();
      if (localConfig) {
        console.log('Loaded layout config from localStorage:', localConfig);
        return localConfig;
      }
    }
    
    console.log('Using default layout configuration');
    return getDefaultLayoutConfig();
    
  } catch (error) {
    console.error('Error loading layout configuration:', error);
    return getDefaultLayoutConfig();
  }
}

async function loadFromContentful(slug: string): Promise<LayoutConfig | null> {
  try {
    const { contentfulClient, LANDING_PAGE_QUERY } = await import('./contentful');
    
    if (!contentfulClient) {
      console.log('Contentful client not configured');
      return null;
    }
    
    const data = await contentfulClient.request<LandingPageData>(LANDING_PAGE_QUERY, { slug });
    const page = data.landingPageCollection.items[0];
    
    if (page && page.layoutConfig) {
      const config = JSON.parse(page.layoutConfig);
      console.log('Parsed Contentful layout config:', config);
      return config;
    }
    
    console.log('No layout config found in Contentful for slug:', slug);
    return null;
  } catch (error) {
    console.error('Error loading from Contentful:', error);
    return null;
  }
}

function loadFromLocalStorage(): LayoutConfig | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem('contentful-layout-config');
    if (stored) {
      const config = JSON.parse(stored);
      console.log('Parsed localStorage config:', config);
      return config;
    }
    console.log('No config found in localStorage');
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

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

export function saveLayoutConfigToLocalStorage(config: LayoutConfig): void {
  if (typeof window !== 'undefined') {
    try {
      const configWithTimestamp = {
        ...config,
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('contentful-layout-config', JSON.stringify(configWithTimestamp));
      console.log('Layout config saved to localStorage:', configWithTimestamp);
      
      const backupKey = `contentful-layout-backup-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(configWithTimestamp));
      
      cleanupOldBackups();
      
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}

function cleanupOldBackups(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('contentful-layout-backup-'))
      .sort()
      .reverse(); 
    
    const keysToDelete = backupKeys.slice(5);
    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
      console.log('Cleaned up old backup:', key);
    });
  } catch (error) {
    console.error('Error cleaning up backups:', error);
  }
}

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