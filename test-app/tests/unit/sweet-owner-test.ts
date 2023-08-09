import Service from '@ember/service';
import { module, test } from 'qunit';

import { sweetenOwner } from 'ember-sweet-owner';

import { setupTest } from '../helpers';

import type { TestContext } from '@ember/test-helpers';

class FooService extends Service {
  prop = 'foo';
}

declare module '@ember/service' {
  interface Registry {
    foo: FooService;
  }
}

module('Unit | Sweet Owner', function (hooks) {
  setupTest(hooks);

  test('can access service from sweet owner', async function (this: TestContext, assert) {
    this.owner.register('service:foo', FooService);

    const container = sweetenOwner(this.owner);

    assert.ok(container.services.foo);
    assert.strictEqual(container.services.foo.prop, 'foo');
  });

  test('destructuring', async function (this: TestContext, assert) {
    this.owner.register('service:foo', FooService);

    const { services } = sweetenOwner(this.owner);
    const { foo } = services;

    assert.ok(foo);
    assert.strictEqual(foo.prop, 'foo');
  });
});
