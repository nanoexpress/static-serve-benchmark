export const sendFile = (res, stream, size) => {
  let aborted = false;
  let done = false;
  let streaming = false;

  res.onAborted(() => {
    aborted = true;
  });

  stream.on("data", (buffer) => {
    if (done || aborted) {
      return;
    }
    buffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    const lastOffset = res.getWriteOffset();
    const [ok, _done] = res.tryEnd(buffer, size);

    if (_done) {
      done = true;
    } else if (!ok) {
      stream.pause();

      res.onWritable((offset) => {
        if (done || aborted) {
          return true;
        }
        const [writeOk, writeDone] = res.tryEnd(
          buffer.slice(offset - lastOffset),
          size
        );
        if (writeDone) {
          done = true;
        } else if (writeOk) {
          stream.resume();
        }
        return writeOk;
      });
    }
  });

  return res;
};
