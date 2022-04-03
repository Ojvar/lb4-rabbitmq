import {BindingKey} from '@loopback/core';
import {RabbitmqService} from './services';

export namespace RabbitmqServiceKeys {
  export const RABBITMQ_SERVICE_EXTENSION_POINT = 'rabbitmq-service';

  export const RABBITMQ_SERVICE = BindingKey.create<RabbitmqService>(
    'services.rabbitmqService',
  );
}
