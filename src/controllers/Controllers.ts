import DashboardController from './DashboardController'
import GraphqlController from './GraphqlController'
import PaymentsController from './PaymentsController'
import AssetsController from './AssetsController'
import GraphiqlController from './GraphiqlController'

export default interface Controllers {
  dashboard: DashboardController
  payments: PaymentsController
  assets: AssetsController
  graphql: GraphqlController
  graphiql: GraphiqlController
}
