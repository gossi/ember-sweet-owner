# ember-sweet-owner 🍬

The dependency injection in ember works through the `Owner`, which registers
objects but also can be used for lookups.
`ember-sweet-owner` brings a sugarized syntax for a typed readonly access on the
`Owner` for better DX.

## Installation

```sh
ember install ember-sweet-owner
```

## Example

Say, you want to access the `session` service with an owner, here is how you do
that:

```ts
import type SessionService from 'ember-simple-auth/services/session';

const session = owner.lookup('service:session') as SessionService;
```

this is quite a cryptic syntax for the lookup string and an API to remember.
This is where `ember-sweet-owner` jumps in, to give you a friendly readonly
access to the `owner`:

```ts
import { sweetenOwner } from 'ember-sweet-owner';

const { services } = sweetenOwner(owner);
const { session } = services;

// do sth with `session`
```

The sweet owner is typed (at least for services) but you can also add your own
types for your own containers (see below).

## Use Cases

`ember-sweet-owner` is best used in situations where you are _not_ in a class
that already has the `owner` set. Most likely in functions (eg.
[`resources`](https://github.com/NullVoxPopuli/ember-resources)).

Here are notable projects making use of `ember-sweet-owner`:

- [`ember-command`](https://github.com/gossi/ember-command)
- [`ember-ability`](https://github.com/gossi/ember-ability)

The duo of `ember-command` (for _write_ operations)  and `ember-ability` (for
_read_ operations) share the same API, thanks to `ember-sweet-owner`.

### Example: Actions and Abilities

Let's say there is a `CounterService`, which you want to access from a single
file component:

```ts
// app/services/counter.ts
import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';

export default class CounterService extends Service {
  @tracked count = 0;

  inc = () => {
    this.count++;
  }

  dec = () => {
    this.count--;
  }
}

declare module '@ember/service' {
  export interface Registry {
    counter: CounterService;
  }
}
```

Accessing the service from with in a single file component:

```glimmer-ts
// app/components/counter.gts
import { action } from 'ember-command';
import { ability } from 'ember-ability';
import { on } from '@ember/modifier';

const inc = action(({ services }) => () => {
  services.counter.inc();
});

const count = ability(({ services }) => () => {
  return services.counter.count;
});

const Counter = <template>
  {{count}} <button type="button" {{on "click" (inc)}}>+</button>
</template>

export { Counter };
```

## Extending the Container Registry Types

By default `services` are typed, thanks to the [`Registry` from
`@ember/service`](https://docs.ember-cli-typescript.com/ts/using-ts-effectively#service-and-controller-injections).
In the same sense `ember-sweet-owner` makes use of the same mechanics. If you
happen to rely on another container, for example an `authenticator`, that is
within the `authenticators/` folder, then you can declare that. Here is the
example from
[ember-simple-auth](https://github.com/mainmatter/ember-simple-auth?tab=readme-ov-file#authenticators)
with extended types from `ember-sweet-owner`:

```ts
// app/authenticators/oauth2.js
import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default class OAuth2Authenticator extends OAuth2PasswordGrantAuthenticator {}

declare module 'ember-sweet-owner' {
  export interface SweetOwner {
    authenticators: {
      oauth2: OAuth2Authenticator;
    }
  }
}
```

That's more to support some ember classic paradigms, but for most of the time,
you want to access services.

## Experimentation: `ember-polaris-service`

For services, there is experimentation coming from
[`ember-polaris-service`](https://github.com/chancancode/ember-polaris-service)
to spin off the traditional DI system of ember by using more verbose and
explicit imports. If you play around with that and install in an app with
`ember-sweet-owner` being present, the latter will become a hybrid to support
the old and the new.

With `ember-polaris-service` installed, here is the same counter example again
from above:

```diff
// app/services/counter.ts
import { tracked } from '@glimmer/tracking';
-import Service from '@ember/service';
+import Service from 'ember-polaris-service';

export default class CounterService extends Service {
  @tracked count = 0;

  inc = () => {
    this.count++;
  }

  dec = () => {
    this.count--;
  }
}

declare module '@ember/service' {
  export interface Registry {
    counter: CounterService;
  }
}
```

Accessing the service from with in a single file component:

```diff
// app/components/counter.gts
import { action } from 'ember-command';
import { ability } from 'ember-ability';
import { on } from '@ember/modifier';
+import CounterService from '../services/counter';

-const inc = action(({ services }) => () => {
+const inc = action(({ service }) => () => {
-  services.counter.inc();
+  service(CounterService).inc();
});

-const count = ability(({ services }) => () => {
+const count = ability(({ service }) => () => {
-  return services.counter.count;
+  return service(CounterService).count;
});

const Counter = <template>
  {{count}} <button type="button" {{on "click" (inc)}}>+</button>
</template>

export { Counter };
```

In order to receive type support, you need to add this to your registry in your
`types/` folder:

```ts
// types/index.d.ts

// ...

import type { ServiceFactory } from 'ember-polaris-service';

declare module 'ember-sweet-owner' {
  export interface SweetOwner {
    service<T>(factory: ServiceFactory<T>): T;
  }
}
```

That is the experimental support from `ember-sweet-owner`. Thanks to macros this
support is only present if you have made `ember-polaris-service` a dependency -
if not the code is stripped away, so you don't pay for something you don't need.
