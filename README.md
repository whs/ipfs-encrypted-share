# IPFS Encrypted Share

Current version: [0.2.0](https://ipfs.io/ipfs/QmWMgNFubY2fg67kTmPofmG4esnSJf8CK89u9XPNLMYpm7/)

Encrypted file uploader for IPFS, similar to [Mega](https://mega.co.nz/)

TODO: Name this something cooler

## Encryption

Your file are encrypted by [libsodium stream encryption](https://download.libsodium.org/doc/secret-key_cryptography/secretstream.html). The encryption key are randomly generated every time and stored in URL fragment (not transmitted to gateway or IPFS).

## Security

This use libsodium, so it should be quite safe to use. However, I'm not a cryptography expert and this code is not audited, so use it at your own risk.
