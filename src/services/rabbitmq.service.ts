import {
  BindingScope,
  config,
  ContextTags,
  extensionPoint,
  extensions,
  Getter,
  injectable,
} from '@loopback/core';
import amqplib from 'amqplib';
import {EventEmitter} from 'stream';
import {RabbitmqServiceKeys} from '../keys';
import {RabbitmqServiceTypes} from '../types';

export enum RabbitmqEvents {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  REGISTER_CONSUMER = 'REGISTER_CONSUMER',
}

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAME]: 'rabbitmqService',
    [ContextTags.NAMESPACE]: 'services',
  },
})
@extensionPoint(RabbitmqServiceKeys.RABBITMQ_SERVICE_EXTENSION_POINT)
export class RabbitmqService extends EventEmitter {
  private _connection: amqplib.Connection;
  private _channel: amqplib.Channel;

  public get channel(): amqplib.Channel {
    return this._channel;
  }

  public get connection(): amqplib.Connection {
    return this._connection;
  }

  constructor(
    @config({optional: true})
    private configs: RabbitmqServiceTypes.RabbitmqConfig,
    @extensions()
    private getConsumers: Getter<RabbitmqServiceTypes.Consumer[]>,
  ) {
    super();

    this.connect()
      .then(res => {
        console.log('Connected to RMQ');
      })
      .catch(err => console.error);
  }

  private async connect(): Promise<void> {
    this._connection = await amqplib.connect(this.configs);
    this._channel = await this._connection.createChannel();

    this.emit(RabbitmqEvents.CONNECTED, {
      connection: this._connection,
      channel: this._channel,
    });

    /* Register all consumers */
    const consumers = await this.getConsumers();
    for (const consumer of consumers) {
      const result = await this.consume(consumer);
      this.emit(RabbitmqEvents.REGISTER_CONSUMER, {consumer, result});
    }
  }

  private async disconnect(): Promise<void> {
    await this._channel.close();
    await this._connection.close();

    this.emit(RabbitmqEvents.DISCONNECTED, {sender: this});
  }

  public publish(
    exchange: string,
    routeKey: string,
    content: Buffer,
    options?: amqplib.Options.Publish | undefined,
  ): boolean {
    return this._channel.publish(exchange, routeKey, content, options);
  }

  public send(
    queue: string,
    content: Buffer,
    options?: amqplib.Options.Publish | undefined,
  ): boolean {
    return this._channel.sendToQueue(queue, content, options);
  }

  public async consume(
    consumer: RabbitmqServiceTypes.Consumer,
  ): Promise<amqplib.Replies.Consume> {
    const result = await this._channel.consume(
      consumer.queue,
      consumer.handler,
      consumer.consumeOptions,
    );

    this.emit(RabbitmqEvents.REGISTER_CONSUMER, {consumer, result});

    return result;
  }
}
