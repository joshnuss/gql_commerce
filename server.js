import { ApolloServer, gql } from 'apollo-server';
import cart from './cart';
import products from './products';

const typeDefs = gql`
  type Query {
    cart: Cart
  }

  type CartItem {
    product: Product!
    quantity: Int!
    subtotal: Int!
  }

  type Cart {
    items: [CartItem!]!
    total: Int!
    currency: String!
  }

  type Product {
    id: ID!
    sku: String
    title: String!
    description: String
    price: Int!
  }

  type Mutation {
    add(productId: ID!, quantity: Int): Cart!
    update(productId: ID!, quantity: Int!): Cart!
    remove(productId: ID!): Cart!
    increment(productId: ID!, by: Int): Cart!
    decrement(productId: ID!, by: Int): Cart!
    empty: Cart!
  }
`;
const resolvers = {
  Query: {
    cart: (obj, args, { cart }) => {
      return cart;
    }
  },
  Mutation: {
    add: (obj, args, { cart }) => {
      const productId = Number.parseInt(args.productId);
      const quantity = args.quantity || 1;

      cart.add(productId, quantity);

      return cart;
    },

    update: (obj, args, { cart }) => {
      const productId = Number.parseInt(args.productId);
      const quantity = args.quantity || 1;

      cart.update(productId, quantity);

      return cart;
    },

    remove: (obj, args, { cart }) => {
      const productId = Number.parseInt(args.productId);

      cart.remove(productId);

      return cart;
    },

    empty: (obj, args, { cart }) => {
      cart.empty();

      return cart;
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { cart, products }
});

server.listen(4001)
  .then(({ url }) => console.log(`Listening on ${url}`));
