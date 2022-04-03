import {
  Binding,
  Component,
  ContextTags,
  createBindingFromClass,
} from '@loopback/core';
import {ConsumersBooter} from '../booters';
import {RabbitmqServiceKeys} from '../keys';
import {RabbitmqService} from '../services';

export class RabbitmqComponent implements Component {
  booters = [ConsumersBooter];

  bindings?: Binding<unknown>[] | undefined = [
    createBindingFromClass(RabbitmqService, {
      [ContextTags.KEY]: RabbitmqServiceKeys.RABBITMQ_SERVICE,
    }),
  ];
}
