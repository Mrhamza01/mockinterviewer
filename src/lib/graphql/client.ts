"use client"
import { ApolloClient, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://mockinterviewer.vercel.app/api/graphql',
    cache: new InMemoryCache(),
  });

export default client;