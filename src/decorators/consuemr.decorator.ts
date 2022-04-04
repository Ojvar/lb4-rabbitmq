import {bind, BindingSpec} from '@loopback/core';
import {RabbitmqServiceTypes} from '../types';

export function queueConsumer(...specs: BindingSpec[]) {
  return bind(RabbitmqServiceTypes.asConsumer, ...specs);
}
