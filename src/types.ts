import {BindingTemplate, ContextTags, extensionFor} from '@loopback/core';
import amqplib from 'amqplib';
import {RabbitmqServiceKeys} from './keys';

export namespace RabbitmqServiceTypes {
  export type RabbitmqConfig = amqplib.Options.Connect;
  export type ConsumeMessage = amqplib.ConsumeMessage;

  export const asConsumer: BindingTemplate = binding => {
    extensionFor(RabbitmqServiceKeys.RABBITMQ_SERVICE_EXTENSION_POINT)(binding);
    binding.tag({
      [ContextTags.NAMESPACE]:
        RabbitmqServiceKeys.RABBITMQ_SERVICE_EXTENSION_POINT,
    });
  };

  export interface Consumer {
    name?: string;
    queue: string;
    consumeOptions?: amqplib.Options.Consume;

    handler(msg: amqplib.ConsumeMessage | null): void;
  }
}
