import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    foo: String!
  }
`;
const resolvers = {};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4001)
  .then(({ url }) => console.log(`Listening on ${url}`));
