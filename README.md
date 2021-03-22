# Simple Transform Stream

Transform a stream with messages separated with valid JSON strings into another stream with transformed JSON strings.

If you think I've missed something, be sure to open an issue or submit a pull request.

## Installation

First install the `simple-transform-stream` library:

```console
  $ npm i simple-transform-stream
```

## Usage

To get the transform stream object:

```js
const transformStream = require('transformStream');
const inputStream = createJSONStream();
/* Input have a stream of valid JSON objects
  { value: 1, type: 'begin' }\n
  { value: 2, type: 'hit' }\n
  { value: 3, type: 'hit' }\n
  { value: 4, type: 'end' }\n
  null
*/
const onMessage = async (message) => ({
  ...message,
  value: message.value * 2
});
const onFailure = (error, message) => console.error(error, message);
const transformedStream = transformStream({
  stream: inputStream,
  onMessage,
  onFailure
});
/* New transformed stream have values
  { value: 2, type: 'begin' }\n
  { value: 4, type: 'hit' }\n
  { value: 6, type: 'hit' }\n
  { value: 8, type: 'end' }\n
  null
*/
```

## License

MIT
