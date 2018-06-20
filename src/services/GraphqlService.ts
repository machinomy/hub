import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'

const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`

const resolvers = {
  Query: {
    books: () => [{title: 'The Daemons', author: 'Dostoyevsky'}]
  },
}

export default class GraphqlService {
  schema: GraphQLSchema

  constructor () {
    this.schema = makeExecutableSchema({ typeDefs, resolvers })
  }
}
