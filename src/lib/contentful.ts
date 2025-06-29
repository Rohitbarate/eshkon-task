import { GraphQLClient } from 'graphql-request';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

let contentfulClient: GraphQLClient | null = null;

if (CONTENTFUL_SPACE_ID && CONTENTFUL_ACCESS_TOKEN) {
  const CONTENTFUL_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`;
  
  contentfulClient = new GraphQLClient(CONTENTFUL_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
    },
  });
}

export { contentfulClient };

export const LANDING_PAGE_QUERY = `
  query LandingPage($slug: String!) {
    landingPageCollection(where: { slug: $slug }, limit: 1) {
      items {
        sys {
          id
        }
        title
        slug
        layoutConfig
        heroBlocksCollection {
          items {
            sys {
              id
            }
            heading
            subtitle
            ctaText
            ctaUrl
            backgroundImage {
              sys {
                id
              }
              title
              description
              url
              width
              height
              contentType
            }
          }
        }
        twoColumnBlocksCollection {
          items {
            sys {
              id
            }
            leftHeading
            leftSubtitle
            leftCtaText
            leftCtaUrl
            rightImage {
              sys {
                id
              }
              title
              description
              url
              width
              height
              contentType
            }
          }
        }
        imageGridBlocksCollection {
          items {
            sys {
              id
            }
            imagesCollection {
              items {
                sys {
                  id
                }
                title
                description
                url
                width
                height
                contentType
              }
            }
          }
        }
      }
    }
  }
`;

export const ALL_LANDING_PAGES_QUERY = `
  query AllLandingPages {
    landingPageCollection {
      items {
        slug
        title
      }
    }
  }
`;

export const UPDATE_LAYOUT_CONFIG_MUTATION = `
  mutation UpdateLayoutConfig($id: String!, $layoutConfig: String!) {
    updateLandingPage(id: $id, data: { layoutConfig: $layoutConfig }) {
      sys {
        id
      }
      layoutConfig
    }
  }
`;