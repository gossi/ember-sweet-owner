import Service from '@ember/service';
import { module, test } from 'qunit';
import { dependencySatisfies, importSync, macroCondition } from '@embroider/macros';

import { sweetenOwner } from 'ember-sweet-owner';

import { setupTest } from '../helpers';

import type { TestContext } from '@ember/test-helpers';
import type PolarisService from 'ember-polaris-service';

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

  test('can access service from sweet owner', function (this: TestContext, assert) {
    this.owner.register('service:foo', FooService);

    const container = sweetenOwner(this.owner);

    assert.ok(container.services.foo);
    assert.strictEqual(container.services.foo.prop, 'foo');
  });

  test('destructuring', function (this: TestContext, assert) {
    this.owner.register('service:foo', FooService);

    const { services } = sweetenOwner(this.owner);
    const { foo } = services;

    assert.ok(foo);
    assert.strictEqual(foo.prop, 'foo');
  });

  if (macroCondition(dependencySatisfies('ember-polaris-service', '*'))) {
    test('polaris-service', function (this: TestContext, assert) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { default: PService } = importSync('ember-polaris-service') as {
        default: typeof PolarisService;
      };

      class TestService extends PService {
        hi = 42;
      }

      const container = sweetenOwner(this.owner);
      const testService = container.service(TestService);

      assert.equal(testService.hi, 42);
    });
  }
});
