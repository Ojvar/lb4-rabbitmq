import {
  Binding,
  Component,
  Constructor,
  ContextTags,
  createBindingFromClass,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ProviderMap,
} from '@loopback/core';
import debugFactory from 'debug';
import {ConsumersBooter} from '../booters';
import {RabbitmqServiceKeys} from '../keys';
import {RabbitmqService} from '../services';

const trace = debugFactory('Rabbitmq-Service:RabbitmqComponent');

export class RabbitmqComponent implements Component {
  lifeCycleObservers?: Constructor<LifeCycleObserver>[];
  bindings?: Binding[];
  providers?: ProviderMap = {};
  booters: unknown[];

  constructor() {
    this.lifeCycleObservers = [RabbitmqObjserver];
    this.booters = [ConsumersBooter];
    this.bindings = [
      createBindingFromClass(RabbitmqService, {
        [ContextTags.KEY]: RabbitmqServiceKeys.RABBITMQ_SERVICE,
      }),
    ];
  }
}

@lifeCycleObserver()
export class RabbitmqObjserver implements LifeCycleObserver {
  constructor(
    @inject(RabbitmqServiceKeys.RABBITMQ_SERVICE)
    private rabbitmqService: RabbitmqService,
  ) {}

  async start() {
    trace('Rabbitmq Starting');
    await this.rabbitmqService.connect();
    trace('Rabbitmq Started');
  }

  async stop() {
    trace('Rabbitmq Stopping');
    await this.rabbitmqService.disconnect();
    trace('Rabbitmq Stoped');
  }
}
