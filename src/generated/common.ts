import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition
    }
  }
  tinkoff: {
    public: {
      invest: {
        api: {
          contract: {
            v1: {
              InstrumentType: EnumTypeDefinition
              MoneyValue: MessageTypeDefinition
              Ping: MessageTypeDefinition
              Quotation: MessageTypeDefinition
              SecurityTradingStatus: EnumTypeDefinition
            }
          }
        }
      }
    }
  }
}

