import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import * as fs from 'fs'
import * as path from 'path'
import Machinomy from 'machinomy/lib/Machinomy'
import { PaymentChannelSerde, SerializedPaymentChannel } from 'machinomy/lib/PaymentChannel'
import { memoize } from 'decko'
import { Context } from 'koa'
import Logger from '@machinomy/logger'

const SCHEMA = path.join(__dirname, '../../data/unidirectional.graphql')

const log = new Logger('service:graphql')

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
    log.info(`channelsQuery: found ${channels.length} channels`)
    return channels.map(channel => {
      return PaymentChannelSerde.instance.serialize(channel)
    })
  }

  async closeChannelMutation (channelId: string, ctx: Context): Promise<SerializedPaymentChannel | null> {
    let channel = await this.machinomy.channelById(channelId)
    log.info(`closeChannelMutation: found channel for id ${channelId}`)
    if (channel) {
      let txResult = await this.machinomy.close(channelId)
      log.info(`closeChannelMutation: closed channel with result ${txResult}`)
      return PaymentChannelSerde.instance.serialize(channel)
    } else {
      return null
    }
  }

  @memoize
  resolvers (ctx: Context) {
    return {
      Query: {
        channels: () => {
          return this.channelsQuery(ctx)
        }
      },
      Mutation: {
        closeChannel: (_: any, params: any) => {
          return this.closeChannelMutation(params.channelId, ctx)
        }
      }
    }
  }
}
