import { type Registry as Services } from '@ember/service';
import { dependencySatisfies, importSync, macroCondition } from '@embroider/macros';

import { singularize } from 'inflection';

import type Owner from '@ember/owner';
import type PolarisService from 'ember-polaris-service';
import type { service as polarisService } from 'ember-polaris-service';

// Related RFC/Types:
// https://rfcs.emberjs.com/id/0585-improved-ember-registry-apis/#appendix-typescript

interface UnknownSweetOwner {
  readonly [container: string]: Record<string, unknown>;
}

interface NamedSweetOwner {
  readonly services: Services;
}

interface SweetOwner extends UnknownSweetOwner, NamedSweetOwner {}

type Lookup = `${string}:${string}`;

class OwnerHandler implements ProxyHandler<Owner> {
  #type: string;
  #owner: Owner;

  #cache = new Map<string, unknown>();

  constructor(owner: Owner, type: string) {
    this.#owner = owner;
    this.#type = type;
  }

  get(_owner: Owner, name: string) {
    const lookup: Lookup = `${this.#type}:${String(name)}`;

    if (!this.#cache.has(lookup)) {
      this.#cache.set(name, this.#owner.lookup(lookup));
    }

    return this.#cache.get(name);
  }
}

function sweetenOwner(owner: Owner): SweetOwner {
  const CACHE = new WeakMap<Owner, Owner>();

  return new Proxy(owner, {
    get(_target: Owner, container: string) {
      if (macroCondition(dependencySatisfies('ember-polaris-service', '*'))) {
        if (container === 'service') {
          const { service, setScope } = importSync('ember-polaris-service') as {
            service: typeof polarisService;
            setScope: (object: object, scope: Owner) => object;
          };
          const scope = {};

          setScope(scope, owner);

          return (lookup: typeof PolarisService) => service(scope, lookup);
        }
      }

      if (!CACHE.has(owner)) {
        CACHE.set(owner, new Proxy(owner, new OwnerHandler(owner, singularize(container))));
      }

      return CACHE.get(owner);
    }
  }) as unknown as SweetOwner;
}

export { sweetenOwner };
export type { SweetOwner };
