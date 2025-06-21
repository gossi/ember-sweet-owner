import type Service from 'ember-polaris-service';
import type { Scope, ServiceFactory } from 'ember-polaris-service';

declare module 'ember-sweet-owner' {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  type ServiceConstructor<T> = typeof Service & ServiceFactory<T> & { new (scope: Scope): T };

  export interface SweetOwner {
    service<S extends ServiceConstructor<unknown>>(factory: S): InstanceType<S>;
  }
}
