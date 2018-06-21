import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import * as fs from 'fs'
import * as path from 'path'
import Machinomy from 'machinomy/lib/Machinomy';
import {PaymentChannelJSON, PaymentChannelSerde, SerializedPaymentChannel} from 'machinomy/lib/PaymentChannel';
import {memoize} from 'decko';
import {Context} from 'koa';

const SCHEMA = path.join(__dirname, '../../data/unidirectional.graphql')

export default class GraphqlService {
  machinomy: Machinomy

  constructor (machinomy: Machinomy) {
    this.machinomy = machinomy
  }

  @memoize
  schema (ctx: Context): GraphQLSchema {
   return makeExecutableSchema({
     typeDefs: this.typeDefs(),
     resolvers: this.resolvers(ctx)
   })
  }

  @memoize
  typeDefs (): string {
    return fs.readFileSync(SCHEMA).toString()
  }

  async channelsQuery (ctx: Context): Promise<Array<SerializedPaymentChannel>> {
    let channels = await this.machinomy.channels()
    return await channels.map(channel => {
      return PaymentChannelSerde.instance.serialize(channel)
    })
  }

  @memoize
  resolvers (ctx: Context) {
    return {
      Query: {
        channels: () => {
          return this.channelsQuery(ctx)
        }
      }
    }
  }
}
