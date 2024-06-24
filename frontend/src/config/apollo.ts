import { ApolloClient, InMemoryCache } from '@apollo/client'

// TODO Make it work with multiple chains
export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
  cache: new InMemoryCache(),
})
