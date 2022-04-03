/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArtifactOptions,
  BaseArtifactBooter,
  BootBindings,
  booter,
} from '@loopback/boot';
import {
  Application,
  Binding,
  BindingFromClassOptions,
  config,
  CoreBindings,
  createBindingFromClass,
  inject,
} from '@loopback/core';
import debugFactory from 'debug';
import {RabbitmqServiceTypes} from '../types';
const trace = debugFactory('Rabbitmq-Service:booter');

@booter('consumers')
export class ConsumersBooter extends BaseArtifactBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
    @inject(BootBindings.PROJECT_ROOT) projectRoot: string,
    @config()
    public consumerConfig: ArtifactOptions = {},
  ) {
    super(projectRoot, Object.assign({}, ConsumersDefaults, consumerConfig));

    trace('consumerConfig: ', consumerConfig);
  }

  async load() {
    await super.load();

    this.classes.forEach(cls => {
      trace('Load cls', cls);
      this.consumers(cls);
    });
  }

  private consumers<T>(
    consumerCtor: RabbitmqServiceTypes.ConsumerClass<T>,
    nameOrOptions?: string | BindingFromClassOptions,
  ): Binding<T> {
    trace('Adding consumer %s', nameOrOptions ?? consumerCtor.name);

    const binding = createBindingFromClass(consumerCtor).apply(
      RabbitmqServiceTypes.asConsumer,
    );
    this.app.add(binding);

    return binding;
  }
}

export const ConsumersDefaults: ArtifactOptions = {
  dirs: ['consumers'],
  extensions: ['.consumer.js'],
  nested: true,
};
