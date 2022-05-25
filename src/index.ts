import { credentials, Metadata } from '@grpc/grpc-js';
import type {
  Client,
  PromiseClient,
  MarketdataType,
  OperationsType,
  OrdersType,
  SandboxType,
  StopordersType,
  UsersType,
} from './types';
import { PROTO_PATH } from './constants';
import { load } from './load';
import { InstrumentsService } from './services/InstrumentsService';
import { promisifyService } from './utils';

export const { SandboxService } = load<SandboxType>(PROTO_PATH + 'sandbox.proto');
export const { UsersService } = load<UsersType>(PROTO_PATH + 'users.proto');
export const { StopOrdersService } = load<StopordersType>(PROTO_PATH + 'stoporders.proto');
export const { OperationsService } = load<OperationsType>(PROTO_PATH + 'operations.proto');
export const { OrdersService, OrdersStreamService } = load<OrdersType>(PROTO_PATH + 'orders.proto');
export const { MarketDataService, MarketDataStreamService } = load<MarketdataType>(
  PROTO_PATH + 'marketdata.proto'
);

interface OpenAPIClientOptions {
  token: string;
  url?: string;

  metadata?: Record<string, string>;
}

class OpenAPIClient {
  token: string;
  url: string;

  instruments: PromiseClient<typeof InstrumentsService>;
  ordersStream: Client<typeof OrdersStreamService>;
  orders: PromiseClient<typeof OrdersService>;
  operations: PromiseClient<typeof OperationsService>;
  marketDataStream: Client<typeof MarketDataStreamService>;
  marketData: PromiseClient<typeof MarketDataService>;
  usersService: PromiseClient<typeof UsersService>;
  stopOrders: PromiseClient<typeof StopOrdersService>;
  sandbox: PromiseClient<typeof SandboxService>;

  constructor(options: OpenAPIClientOptions) {
    this.token = options.token;
    this.url = options.url || 'invest-public-api.tinkoff.ru:443';

    const providedMetadata = options.metadata || {};

    const metadata = new Metadata();
    metadata.add('Authorization', 'Bearer ' + this.token);
    for (const providedMetadataKey in providedMetadata) {
      metadata.add(providedMetadataKey, providedMetadata[providedMetadataKey]);
    }

    const ssl_creds = credentials.combineChannelCredentials(
      credentials.createSsl(),
      credentials.createFromMetadataGenerator((_: any, callback: any) => callback(null, metadata))
    );

    this.instruments = promisifyService(new InstrumentsService(this.url, ssl_creds));
    this.ordersStream = new OrdersStreamService(this.url, ssl_creds);
    this.marketDataStream = new MarketDataStreamService(this.url, ssl_creds);
    this.marketData = promisifyService(new MarketDataService(this.url, ssl_creds));
    this.usersService = promisifyService(new UsersService(this.url, ssl_creds));
    this.orders = promisifyService(new OrdersService(this.url, ssl_creds));
    this.operations = promisifyService(new OperationsService(this.url, ssl_creds));
    this.stopOrders = promisifyService(new StopOrdersService(this.url, ssl_creds));
    this.sandbox = promisifyService(new SandboxService(this.url, ssl_creds));
  }
}

export { OpenAPIClient };
