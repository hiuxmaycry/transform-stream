global.window = global;

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
