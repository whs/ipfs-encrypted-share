# IPFS Encrypted Share

Current version: [0.2.0](https://ipfs.io/ipfs/QmWMgNFubY2fg67kTmPofmG4esnSJf8CK89u9XPNLMYpm7/)

Encrypted file uploader for IPFS, similar to [Mega](https://mega.co.nz/)

## Security

This use libsodium, so it should be quite safe to use. However, I'm not a cryptography expert and this code is not audited, so use it at your own risk.

## Technical details

### Encryption

Files are encrypted with [libsodium stream encryption](https://download.libsodium.org/doc/secret-key_cryptography/secretstream.html). The encryption key are randomly generated every time and stored as urlsafe unpadded base64 in URL fragment (not transmitted to gateway or IPFS).

### Metadata

File metadata is stored at /metadata.json. It contains 2 keys:

-   **header**: Stream header (from crypto_secretstream_xchacha20poly1305_init_push), base64 encoded without padding.
-   **encryptedMetadata**: Encrypted metadata, base64 encoded without padding.

The encrypted metadata is the first message in the stream. It is a JSON with the following keys:

-   **filename**: Original filename
-   **size**: File size in bytes
-   **pieces**: Number of file pieces

This message has the tag `crypto_secretstream_xchacha20poly1305_TAG_FINAL`.

### File pieces

The file are splitted to pieces, each 5MB in size. (limited by libsodium.js heap size) They are encrypted and stored at /pieces/`chunkId`. ChunkID starts at 0 to `encryptedMetadata.pieces - 1`.

The final piece has the tag `crypto_secretstream_xchacha20poly1305_TAG_FINAL`. All other pieces has the tag `0`.

## License

Licensed under the [MIT License](LICENSE)
