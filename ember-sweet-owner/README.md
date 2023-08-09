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

Let's say we want to access `isAuthenticated` from `session` service from
[`ember-simple-auth`](https://github.com/simplabs/ember-simple-auth) in a
function.

```ts
function canLogin({ services }) {
  const { session } = services;

  return session.isAuthenticated;
}
```

which can be invoked from within a component:

```ts
import { getOwner } from '@ember/owner';
import Component from '@glimmer/component';
import { sweetenOwner } from 'ember-sweet-owner';

export default class MyComponent extends Component {

  get canLogin() {
    return canLogin(sweetenOwner(getOwner(this)));
  }
}
```
