import 'ember-source/types';
import 'ember-source/types/preview';
import '@glint/environment-ember-loose';

import type { ServiceFactory } from 'ember-polaris-service';

declare module 'ember-sweet-owner' {
  export interface SweetOwner {
    service<T>(factory: ServiceFactory<T>): T;
  }
}
