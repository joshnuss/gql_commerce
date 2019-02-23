import { ApolloServer, gql } from 'apollo-server';
import cart from './cart';
import products from './products';
import pubsub from './pubsub';

const typeDefs = gql`
  type Query {
    products: [Product!]!
    cart: Cart!
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

  type Subscription {
    cartChanged: Cart!
  }
`;

const resolvers = {
  Query: {
    products: (_, args, { products }) => Object.values(products),
    cart: (_, args, { cart }) => cart,
  },
  Mutation: {
    add: (_, args, { cart }) => {
      const productId = Number.parseInt(args.productId);
      const quantity = args.quantity || 1;

      cart.add(productId, quantity);

      return cart;
    },

    update: (_, args, { cart }) => {
      const productId = Number.parseInt(args.productId);
      const quantity = args.quantity || 1;

      cart.update(productId, quantity);

      return cart;
    },

    remove: (_, args, { cart }) => {
      const productId = Number.parseInt(args.productId);

      cart.remove(productId);

      return cart;
    },

    increment: (_, args, { cart }) => {
      const productId = Number.parseInt(args.productId);
      const by = args.by || 1;

      cart.increment(productId, by);

      return cart;
    },

    decrement: (_, args, { cart }) => {
      const productId = Number.parseInt(args.productId);
      const by = args.by || 1;

      cart.decrement(productId, by);

      return cart;
    },

    empty: (_, args, { cart }) => {
      cart.empty();

      return cart;
    }
  },
  Subscription: {
    cartChanged: {
      subscribe: () => pubsub.asyncIterator('cartChanged')
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { cart, products }
});

server.listen()
  .then(({ url }) => console.log(`Listening on ${url}`));
