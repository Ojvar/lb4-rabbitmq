import {
  Binding,
  Component,
  ContextTags,
  createBindingFromClass,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import debugFactory from 'debug';
import {ConsumersBooter} from '../booters';
import {RabbitmqServiceKeys} from '../keys';
import {RabbitmqService} from '../services';

const trace = debugFactory('RabbitmqService:RabbitmqComponent');

export class RabbitmqComponent implements Component {
  lifeCycleObservers = [RabbitmqObjserver];
  booters = [ConsumersBooter];
  bindings?: Binding<unknown>[] | undefined = [
    createBindingFromClass(RabbitmqService, {
      [ContextTags.KEY]: RabbitmqServiceKeys.RABBITMQ_SERVICE,
    }),
  ];
}

@lifeCycleObserver()
export class RabbitmqObjserver implements LifeCycleObserver {
  constructor(
    @inject(RabbitmqServiceKeys.RABBITMQ_SERVICE)
    private rabbitmqService: RabbitmqService,
  ) {}

  async start() {
    trace('Lifecycle -> Start');
    await this.rabbitmqService.connect();
  }

  async stop() {
    trace('Lifecycle -> Stop');
  }
}
