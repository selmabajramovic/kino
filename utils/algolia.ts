import algoliasearch from "algoliasearch";

// @ts-ignore
const client = algoliasearch('WWQWXD8XG2', process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('Filmovi');

export { index }