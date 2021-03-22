# Simple Transform Stream

Transform a stream with messages separated with valid JSON strings into another stream with transformed JSON strings.

If you think I've missed something, be sure to open an issue or submit a pull request.

## Installation

First install the `simple-transform-stream` library:

  $ npm i simple-transform-stream

## Usage

To get the transform stream object:

```js
const transformStream = require('transformStream');
const values = [
  { value: 1, type: 'begin' },
  { value: 2, type: 'hit' },
  { value: 3, type: 'hit' },
  { value: 4, type: 'end' }
];
const expectedResult = [
  JSON.stringify({ value: 2, type: 'begin' }),
  JSON.stringify({ value: 4, type: 'hit' }),
  JSON.stringify({ value: 6, type: 'hit' }),
  JSON.stringify({ value: 8, type: 'end' })
];
const inputStream = new Readable({
  read() {
    this.push(JSON.stringify(values[count]));
    count += 1;
    if (count === values.length) {
      this.push(null);
    }
  }
});
const transformedStream = transformStream({
  stream: inputStream,
  onMessage
});

```

## License

MIT
