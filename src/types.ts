import {BindingTemplate, ContextTags, extensionFor} from '@loopback/core';
import amqplib from 'amqplib';
import {RabbitmqServiceKeys} from './keys';

export namespace RabbitmqServiceTypes {
  export type RabbitmqChannel = amqplib.Channel;
  export type RabbitmqOptionsPublish = amqplib.Options.Publish;
  export type RabbitmqConfig = amqplib.Options.Connect;
  export type ConsumeMessage = amqplib.ConsumeMessage;
  export type OptionsConsume = amqplib.Options.Consume;

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
    consumeOptions?: OptionsConsume;

    handler(
      channel: RabbitmqServiceTypes.RabbitmqChannel,
      msg: RabbitmqServiceTypes.ConsumeMessage | null,
    ): void;
  }
}
