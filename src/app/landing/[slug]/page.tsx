import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { LandingPage, LayoutComponent } from '../../../types/contentful';
import { loadLayoutConfig } from '../../../lib/layoutConfigLoader';
import Navigation from '../../../components/layout/Navigation';
import HeroBlock from '../../../components/landing/HeroBlock';
import TwoColumnBlock from '../../../components/landing/TwoColumnBlock';
import ImageGridBlock from '../../../components/landing/ImageGridBlock';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getLandingPage(slug: string): Promise<LandingPage | null> {
  // Check if Contentful credentials are available
  const hasContentfulCredentials = 
    process.env.CONTENTFUL_SPACE_ID && 
    process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!hasContentfulCredentials) {
    // Return mock data when Contentful is not configured
    return {
      sys: { id: `mock-${slug}` },
      title: slug === 'page-1' ? 'Demo Landing Page 1' : 'Demo Landing Page 2',
      slug,
      layoutConfig: {
        components: [],
        updatedAt: new Date().toISOString(),
      },
      heroBlocksCollection: { items: [] },
      twoColumnBlocksCollection: { items: [] },
      imageGridBlocksCollection: { items: [] },
    };
  }

  try {
    // Only import and use Contentful client if credentials are available
    const { contentfulClient, LANDING_PAGE_QUERY } = await import('../../../lib/contentful');
    if (!contentfulClient) {
      throw new Error('Contentful client is not initialized.');
    }
    const data = await contentfulClient.request(LANDING_PAGE_QUERY, { slug });
    return data?.landingPageCollection?.items[0] || null;
  } catch (error) {
    console.error('Error fetching landing page:', error);
    // Fall back to mock data on error
    return {
      sys: { id: `fallback-${slug}` },
      title: slug === 'page-1' ? 'Demo Landing Page 1' : 'Demo Landing Page 2',
      slug,
      layoutConfig: {
        components: [],
        updatedAt: new Date().toISOString(),
      },
      heroBlocksCollection: { items: [] },
      twoColumnBlocksCollection: { items: [] },
      imageGridBlocksCollection: { items: [] },
    };
  }
}

export async function generateStaticParams() {
  // For demo purposes, return the two pages we want to generate
  return [
    { slug: 'page-1' },
    { slug: 'page-2' },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getLandingPage(params.slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.title,
    description: `${page.title} - Built with our page builder`,
    openGraph: {
      title: page.title,
      description: `${page.title} - Built with our page builder`,
      type: 'website',
    },
  };
}

const LandingPageRoute: React.FC<PageProps> = async ({ params }) => {
  const page = await getLandingPage(params.slug);

  if (!page) {
    notFound();
  }

  // Load the layout configuration (this is where the JSON config is used!)
  const layoutConfig = await loadLayoutConfig(params.slug);
  
  console.log('Rendering landing page with layout config:', layoutConfig);

  const renderComponent = (component: LayoutComponent) => {
    switch (component.type) {
      case 'hero':
        return <HeroBlock key={component.id} data={component.data as any} />;
      case 'twoColumn':
        return <TwoColumnBlock key={component.id} data={component.data as any} />;
      case 'imageGrid':
        return <ImageGridBlock key={component.id} data={component.data as any} />;
      default:
        console.warn(`Unknown component type: ${component.type}`);
        return null;
    }
  };

  // Add JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: `${page.title} - Built with our page builder`,
    url: `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/landing/${params.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.title,
          item: `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/landing/${params.slug}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navigation />
      
      <main>
        {/* This is where the magic happens - rendering components from JSON config */}
        {layoutConfig?.components
          .sort((a, b) => a.order - b.order)
          .map(renderComponent)}
        
        {/* Show a message if no components are configured */}
        {(!layoutConfig?.components || layoutConfig.components.length === 0) && (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: '#f9fafb',
            color: '#6b7280'
          }}>
            <h2>No components configured</h2>
            <p>Use the page builder to add components to this page.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default LandingPageRoute;