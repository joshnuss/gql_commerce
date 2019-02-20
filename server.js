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
    add: (obj, args, { cart, products }) => {
      const productId = Number.parseInt(args.productId);
      const product = products[productId];

      if (!product) {
        throw new Error('Unknown product');
      }

      const item = cart.items.find(line => line.product.id === productId);
      const quantity = args.quantity || 1;

      if (item) {
        item.quantity += quantity;
        item.subtotal = product.price * item.quantity;
      } else {
        cart.items.push({
          product,
          quantity,
          subtotal: product.price * quantity,
        });
      }

      return cart;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { cart, products }
});

server.listen(4001)
  .then(({ url }) => console.log(`Listening on ${url}`));
