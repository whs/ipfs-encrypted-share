import sodium from "libsodium-wrappers";
import { FILE_NONCE, FILENAME_NONCE } from "./browserencrypt";

function decodeKey(key) {
  return sodium.from_base64(key, sodium.base64_variants.URLSAFE_NO_PADDING);
}

export const decryptMetadata = (data, key) => {
  key = decodeKey(key);
  let filename = sodium.from_base64(
    data.filename,
    sodium.base64_variants.ORIGINAL_NO_PADDING
  );
  data.filename = sodium.to_string(
    sodium.crypto_secretbox_open_easy(filename, FILENAME_NONCE, key)
  );
  return data;
};

export const decrypt = (data, metadata, key) => {
  let mac = sodium.from_base64(
    metadata.mac,
    sodium.base64_variants.ORIGINAL_NO_PADDING
  );
  return sodium.crypto_secretbox_open_detached(
    data,
    mac,
    FILE_NONCE,
    decodeKey(key)
  );
};
