import type Owner from '@ember/owner';
import { type Registry as Services } from '@ember/service';
import { singularize } from 'inflection';

// Related RFC/Types:
// https://rfcs.emberjs.com/id/0585-improved-ember-registry-apis/#appendix-typescript

interface UnknownContainers {
  readonly [container: string]: Record<string, unknown>;
}

interface NamedContainers {
  readonly services: Services;
}

type Container = UnknownContainers & NamedContainers;

type Lookup = `${string}:${string}`;

class ContainerHandler implements ProxyHandler<Owner> {
  #type: string;
  #owner: Owner;

  #cache = new Map<string, unknown>();

  constructor(owner: Owner, type: string) {
    this.#owner = owner;
    this.#type = type;
  }

  get(_target: Owner, name: string) {
    const lookup: Lookup = `${this.#type}:${String(name)}`;
    if (!this.#cache.has(lookup)) {
      this.#cache.set(name, this.#owner.lookup(lookup));
    }
    return this.#cache.get(name);
  }
}

function makeContainer(owner: Owner): Container {
  const CACHE = new WeakMap<Owner, Owner>();

  return new Proxy(owner, {
    get(_target: Owner, container: string) {
      if (!CACHE.has(owner)) {
        CACHE.set(owner, new Proxy(owner, new ContainerHandler(owner, singularize(container))));
      }

      return CACHE.get(owner);
    }
  }) as unknown as Container;
}

export { makeContainer };
