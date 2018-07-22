import PromiseFileReader from "promise-file-reader";
import sodium from "libsodium-wrappers";

/**
 * salsa20 does not require nonce to be random, only used once per key
 * since we generate new key every time then it is safe to hardcode the nonce
 */

// prettier-ignore
export const FILE_NONCE = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
// prettier-ignore
export const FILENAME_NONCE = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]);

export default file => {
  return Promise.all([
    PromiseFileReader.readAsArrayBuffer(file),
    sodium.ready
  ]).then(res => {
    let buffer = res[0];
    res = null;

    let key = sodium.crypto_secretbox_keygen();
    let encrypted = sodium.crypto_secretbox_detached(
      new Uint8Array(buffer), // this does copy the buffer
      FILE_NONCE,
      key
    );
    buffer = null;

    let filenameBuffer = sodium.from_string(file.name);
    let filenameEncrypted = sodium.crypto_secretbox_easy(
      filenameBuffer,
      FILENAME_NONCE,
      key
    );
    filenameBuffer = null;

    let metadata = {
      filename: sodium.to_base64(
        filenameEncrypted,
        sodium.base64_variants.ORIGINAL_NO_PADDING
      ),
      mac: sodium.to_base64(
        encrypted.mac,
        sodium.base64_variants.ORIGINAL_NO_PADDING
      ),
      size: file.size
    };

    return {
      file: encrypted.cipher,
      key: sodium.to_base64(key, sodium.base64_variants.URLSAFE_NO_PADDING),
      metadata: metadata
    };
  });
};
