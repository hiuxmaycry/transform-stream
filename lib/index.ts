import { Stream, Transform } from 'stream';

function buildJSONStreamingEvent(data) {
  return Buffer.from(`${JSON.stringify(data)}\n`);
}

function buildMessageFromChunk(chunk) {
  let message;
  try {
    message = JSON.parse(chunk);
  } catch (error) {
    message = null;
  }

  return message;
}

async function transformMessage(onMessage, onFailure, message, encoding) {
  let transformedMessage;
  try {
    transformedMessage = await onMessage(message, encoding);
  } catch (error) {
    onFailure(error, message);
    transformedMessage = message;
  }

  return transformedMessage;
}

function createTransform(onMessage, onFailure) {
  let internalBuffer = '';
  const decoder = new TextDecoder();
  const decode = (chunk) => decoder.decode(chunk, { stream: true });

  return new Transform({
    async transform(chunk, encoding, callback) {
      if (!chunk) {
        this.push(null);
      }

      const decodedChunks = (internalBuffer + decode(chunk)).split('\n');

      for (let index = 0; index < decodedChunks.length; index += 1) {
        internalBuffer = decodedChunks[index];
        const message = buildMessageFromChunk(internalBuffer);

        if (message) {
          const transformedMessage = await transformMessage(
            onMessage,
            onFailure,
            message,
            encoding
          );

          this.push(buildJSONStreamingEvent(transformedMessage));
          internalBuffer = '';
        }
      }

      callback();
    }
  });
}

export default function transformStream({
  stream,
  onMessage,
  onFailure = () => null
}: {
  stream: Stream;
  onMessage: (message, encoding) => string;
  onFailure: () => void;
}): Stream {
  const transform = createTransform(onMessage, onFailure);

  stream.pipe(transform);

  return transform;
}
