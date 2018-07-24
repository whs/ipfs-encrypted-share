import sodium from 'libsodium-wrappers';

export default class Decryptor {
	constructor(key) {
		this.key = sodium.from_base64(key, sodium.base64_variants.URLSAFE_NO_PADDING);
	}

	decryptMetadata(data) {
		if (this.metadata) {
			return this.metadata;
		}

		let header = sodium.from_base64(data.header, sodium.base64_variants.ORIGINAL_NO_PADDING);
		let encryptedMetadata = sodium.from_base64(data.encryptedMetadata, sodium.base64_variants.ORIGINAL_NO_PADDING);
		this.state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, this.key);
		let { message, tag } = sodium.crypto_secretstream_xchacha20poly1305_pull(this.state, encryptedMetadata);
		message = JSON.parse(sodium.to_string(message));

		if (tag !== sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
			throw new Error('metadata chunk not ended with final tag');
		}

		this.metadata = Object.assign({}, data, message);

		return this.metadata;
	}

	decrypt(data, isLast = false) {
		if (!this.metadata || !this.state) {
			throw new Error('decrypt metadata first');
		}

		let { message, tag } = sodium.crypto_secretstream_xchacha20poly1305_pull(this.state, data);

		let expectedTag = isLast ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL : 0;
		if (tag !== expectedTag) {
			throw new Error('Unexpected tag for piece');
		}

		return message;
	}
}
