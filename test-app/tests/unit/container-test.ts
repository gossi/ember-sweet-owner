import { module, test } from 'qunit';
import { setupTest } from '../helpers';
import { makeContainer } from 'ember-container';
import Service from '@ember/service';

class FooService extends Service {
  prop = 'foo';
}

declare module '@ember/service' {
  interface Registry {
    foo: FooService;
  }
}

module('Unit | Container', function (hooks) {
  setupTest(hooks);

  test('can access service from container', async function (assert) {
    this.owner.register('service:foo', FooService);

    const container = makeContainer(this.owner);

    assert.ok(container.services.foo);
    assert.equal(container.services.foo.prop, 'foo');
  });

  test('destructuring', async function (assert) {
    this.owner.register('service:foo', FooService);

    const { services } = makeContainer(this.owner);
    const { foo } = services;

    assert.ok(foo);
    assert.equal(foo.prop, 'foo');
  });
});
