import DashboardController from './DashboardController'
import GraphqlController from './GraphqlController'
import PaymentsController from './PaymentsController'
import AssetsController from './AssetsController'
import GraphiqlController from './GraphiqlController'
import AuthController from './AuthController'

export default interface Controllers {
  dashboard: DashboardController
  payments: PaymentsController
  assets: AssetsController
  graphql: GraphqlController
  graphiql: GraphiqlController
  auth: AuthController
}
