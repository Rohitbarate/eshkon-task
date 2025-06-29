export interface LayoutComponent {
  id: string;
  type: 'hero' | 'twoColumn' | 'imageGrid';
  order: number;
  data: HeroData | TwoColumnData | ImageGridData;
}

export interface HeroData {
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage: ContentfulAsset;
}

export interface TwoColumnData {
  leftHeading: string;
  leftSubtitle: string;
  leftCtaText: string;
  leftCtaUrl: string;
  rightImage: ContentfulAsset;
}

export interface ImageGridData {
  images: ContentfulAsset[];
}

export interface ContentfulAsset {
  sys: {
    id: string;
  };
  title: string;
  description?: string;
  url: string;
  width: number;
  height: number;
  contentType: string;
}

export interface LayoutConfig {
  components: LayoutComponent[];
  updatedAt: string;
}

export interface LandingPage {
  sys: {
    id: string;
  };
  title: string;
  slug: string;
  layoutConfig: LayoutConfig;
  heroBlocksCollection: {
    items: HeroBlock[];
  };
  twoColumnBlocksCollection: {
    items: TwoColumnBlock[];
  };
  imageGridBlocksCollection: {
    items: ImageGridBlock[];
  };
}

export interface HeroBlock {
  sys: { id: string };
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage: ContentfulAsset;
}

export interface TwoColumnBlock {
  sys: { id: string };
  leftHeading: string;
  leftSubtitle: string;
  leftCtaText: string;
  leftCtaUrl: string;
  rightImage: ContentfulAsset;
}

export interface ImageGridBlock {
  sys: { id: string };
  imagesCollection: {
    items: ContentfulAsset[];
  };
}