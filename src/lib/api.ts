
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../../types/graphql-types'; 
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL не визначено');
}

export const client = new GraphQLClient(API_URL,{
  method: 'POST',
  headers: {
  },
});
export const sdk = getSdk(client);