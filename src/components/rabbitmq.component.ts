import {Component, ContextTags, createBindingFromClass} from '@loopback/core';
import {RabbitmqServiceKeys} from '../keys';
import {RabbitmqService} from '../services';

export class RabbitmqComponent implements Component {
  bindings = [
    createBindingFromClass(RabbitmqService, {
      [ContextTags.KEY]: RabbitmqServiceKeys.RABBITMQ_SERVICE,
    }),
  ];
}
