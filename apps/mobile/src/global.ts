if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      const utf8 = unescape(encodeURIComponent(input));
      const result = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
      }
      return result;
    }
  };
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(input: Uint8Array | ArrayBuffer): string {
      const bytes = new Uint8Array(input);
      return decodeURIComponent(escape(String.fromCharCode.apply(null, Array.from(bytes))));
    }
  };
}

// Add this if you need TextDecoderStream
if (typeof global.TextDecoderStream === 'undefined') {
  global.TextDecoderStream = class TextDecoderStream {
    constructor(label = 'utf-8', options = {}) {
      this._decoder = new TextDecoder(label, options);
    }

    readable = null;
    writable = null;

    decode(chunk: Uint8Array): string {
      return this._decoder.decode(chunk, { stream: true });
    }
  };
}