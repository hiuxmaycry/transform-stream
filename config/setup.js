import { expect, use, should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon, { createSandbox, restore } from 'sinon';
import sinonChai from 'sinon-chai';

global.window = global;
global.expect = expect;

use(chaiAsPromised);
use(sinonChai);
should();


beforeEach(() => {
  global.sandbox = createSandbox();
});

afterEach(function showPendingMocks() {
  const pending = getPendingStubs(sinon);

  if (pending.length > 0) {
    throw new Error(`Mocks still pending: ${JSON.stringify(pending, null, 2)}`);
  }

  function getPendingStubs($sinon) {
    return ($sinon.fakes || [])
      .filter((fake) => fake.fakes)
      .filter((fake) => fake.callCount === 0)
      .map(({ displayName }) => ({ type: 'sinon', mock: displayName }));
  }
});

afterEach(function closeTest() {
  restore();
  global.sandbox.restore();
});

let unhandledRejection;

process.on('unhandledRejection', (err) => {
  unhandledRejection = err;
});

afterEach(() => {
  if (unhandledRejection) {
    /* eslint-disable no-console */
    console.error('>>', 'Enforced failure on UnhandledPromiseRejectionWarning');
    console.error(unhandledRejection);
    /* eslint-enable no-console */
    const error = unhandledRejection;
    unhandledRejection = undefined;
    throw error;
  }
});
