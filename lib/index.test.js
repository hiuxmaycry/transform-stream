import { expect } from 'chai';
import { Readable } from 'stream';
import transformStream from './index';

function streamToString(stream) {
  const chunks = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
}

describe('index', () => {
  describe('transformStream()', () => {
    let inputStream;
    let transformedStream;
    let values;
    let expectedResult;
    let count;
    let onMessage;

    beforeEach(() => {
      count = 0;
      values = [
        { value: 1, type: 'begin' },
        { value: 2, type: 'hit' },
        { value: 3, type: 'hit' },
        { value: 4, type: 'end' }
      ];
      expectedResult = [
        JSON.stringify({ value: 2, type: 'begin' }),
        JSON.stringify({ value: 4, type: 'hit' }),
        JSON.stringify({ value: 6, type: 'hit' }),
        JSON.stringify({ value: 8, type: 'end' })
      ]
        .join('\n')
        .concat('\n');
      onMessage = async (message) => ({
        ...message,
        value: message.value * 2
      });
    });

    describe('When transform operation receives normal chunk', () => {
      beforeEach(() => {
        inputStream = new Readable({
          read() {
            this.push(JSON.stringify(values[count]));
            count += 1;
            if (count === values.length) {
              this.push(null);
            }
          }
        });
        transformedStream = transformStream({
          stream: inputStream,
          onMessage
        });
      });

      it('should return correct transformed stream', async () => {
        const buffer = await streamToString(transformedStream);

        buffer.should.be.equals(expectedResult);
      });
    });

    describe('When input stream has multiple newlines in chunk', () => {
      beforeEach(() => {
        inputStream = new Readable({
          read() {
            this.push(`${JSON.stringify(values[count])}\n\n\n`);
            count += 1;
            if (count === values.length) {
              this.push(null);
            }
          }
        });
        transformedStream = transformStream({
          stream: inputStream,
          onMessage
        });
      });

      it('should return correct transformed stream', async () => {
        const buffer = await streamToString(transformedStream);

        buffer.should.be.equals(expectedResult);
      });
    });

    describe('When input stream has newline between chunk', () => {
      beforeEach(() => {
        inputStream = new Readable({
          read() {
            const chunks = `${JSON.stringify(values[count])}`.split(',');
            this.push(chunks[0]);
            this.push(`,${chunks[1]}\n`);
            count += 1;
            if (count === values.length) {
              this.push(null);
            }
          }
        });
        transformedStream = transformStream({
          stream: inputStream,
          onMessage
        });
      });

      it('should return correct transformed stream', async () => {
        const buffer = await streamToString(transformedStream);

        buffer.should.be.equals(expectedResult);
      });
    });

    describe('When input stream has non JSON object between chunks', () => {
      const nonJSONObject = '-,a.';

      beforeEach(() => {
        inputStream = new Readable({
          read() {
            this.push(`${nonJSONObject}\n`);
            this.push(JSON.stringify(values[count]));
            count += 1;
            if (count === values.length) {
              this.push(null);
            }
          }
        });
        transformedStream = transformStream({
          stream: inputStream,
          onMessage
        });
      });

      it('should return correct transformed stream and filter non parse objects', async () => {
        const buffer = await streamToString(transformedStream);

        buffer.should.be.equals(expectedResult);
      });
    });

    describe('When input stream has an error to transform one chunk', () => {
      let onFailure;

      beforeEach(() => {
        inputStream = new Readable({
          read() {
            this.push(JSON.stringify(values[count]));
            count += 1;
            if (count === values.length) {
              this.push(null);
            }
          }
        });
        onMessage = async (message) => {
          if (message.value <= 2) {
            throw new Error('error');
          }

          return {
            ...message,
            value: message.value * 2
          };
        };
        onFailure = jest.fn();
        transformedStream = transformStream({
          stream: inputStream,
          onMessage,
          onFailure
        });
        expectedResult = [
          JSON.stringify({ value: 1, type: 'begin' }),
          JSON.stringify({ value: 2, type: 'hit' }),
          JSON.stringify({ value: 6, type: 'hit' }),
          JSON.stringify({ value: 8, type: 'end' })
        ]
          .join('\n')
          .concat('\n');
      });

      it('should return correct stream with no change in the first two chunk', async () => {
        const buffer = await streamToString(transformedStream);

        buffer.should.be.equals(expectedResult);
        expect(onFailure.should.have.been.calledTwice);
        const { firstCall, secondCall } = onFailure;

        firstCall.args[0].message.should.equals('error');
        firstCall.args[1].should.be.deep.equals({
          value: 1,
          type: 'begin'
        });
        secondCall.args[0].message.should.equals('error');
        secondCall.args[1].should.be.deep.equals({
          value: 2,
          type: 'hit'
        });
      });
    });
  });
});
