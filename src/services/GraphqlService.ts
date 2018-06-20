import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'

const typeDefs = `
  type Query {
    books: [Book]
  }
  
  type Mutation {
    createNonce(address: String!): Nonce
  }
  
  type Book {
    title: String
    author: String
  }
  
  type Nonce {
    value: String!
    address: String!
    until: String!
  }
`

const resolvers = {
  Query: {
    books: () => [{title: 'The Daemons', author: 'Dostoyevsky'}]
  },
  Mutation: {
    createNonce: (address: string) => {
      return {
        value: 'nonce',
        address: '0xdead',
        until: '1H'
      }
    }
  }
}

export default class GraphqlService {
  schema: GraphQLSchema

  constructor () {
    this.schema = makeExecutableSchema({ typeDefs, resolvers })
  }
}
