import algoliasearch from "algoliasearch";

const client = algoliasearch('WWQWXD8XG2', process.env.NEXT_PRIVATE_ALGOLIA_ADMIN_API_KEY!);
const index = client.initIndex('Filmovi');

export { index }