import {bind, BindingSpec} from '@loopback/core';
import {asConsumer} from '../types';

export function queueConsumer(...specs: BindingSpec[]) {
  return bind(asConsumer, ...specs);
}
