import type { Metadata, CallOptions } from '@grpc/grpc-js';

export type { ProtoGrpcType as InstrumentsType } from './generated/instruments';
export type { ProtoGrpcType as MarketdataType } from './generated/marketdata';
export type { ProtoGrpcType as OrdersType } from './generated/orders';
export type { ProtoGrpcType as OperationsType } from './generated/operations';
export type { ProtoGrpcType as SandboxType } from './generated/sandbox';
export type { ProtoGrpcType as StopordersType } from './generated/stoporders';
export type { ProtoGrpcType as UsersType } from './generated/users';

export type ServicePath<T extends Basic> =
  T['tinkoff']['public']['invest']['api']['contract']['v1'];
export type Basic = {
  tinkoff: {
    public: {
      invest: {
        api: {
          contract: {
            v1: {};
          };
        };
      };
    };
  };
};

type NotUndef<T> = T extends undefined ? never : T;
type PromiseMethod<T> = T extends (args: infer ARGS, cb: () => any) => any
  ? (
      args: ARGS,
      metadata?: Metadata,
      options?: CallOptions
    ) => Promise<NotUndef<Parameters<Parameters<T>[1]>[1]>>
  : never;

export type InputService = { [key: string]: any };
export type PromiseService<Service> = Service extends InputService
  ? { [Method in keyof Service]: PromiseMethod<Service[Method]> }
  : never;

export type Client<Constructor> = Constructor extends new (...args: any) => infer R ? R : null;
export type PromiseClient<T> = PromiseService<Client<T>>;
