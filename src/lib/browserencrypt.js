import PromiseFileReader from 'promise-file-reader';
import sodium from 'libsodium-wrappers';

const FILE_CHUNK_SIZE = 5 * 1024 * 1024;

export default (file, progress = () => {}) => {
	return Promise.all([PromiseFileReader.readAsArrayBuffer(file), sodium.ready]).then((res) => {
		let buffer = res[0];
		res = null;

		let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
		let { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);

		// encrypt the metadata
		let piecesCount = Math.ceil(buffer.byteLength / FILE_CHUNK_SIZE);
		let encryptedMetadata = {
			filename: file.name,
			size: file.size,
			pieces: piecesCount,
		};
		let metadataBuffer = sodium.from_string(JSON.stringify(encryptedMetadata));
		let metadataEncrypted = sodium.crypto_secretstream_xchacha20poly1305_push(
			state,
			metadataBuffer,
			null,
			sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
		);
		metadataBuffer = null;

		// then split the files into pieces
		let promise = new Promise((resolve, reject) => {
			let pieces = [];
			let offset = 0;
			let chunk = () => {
				console.log(`Piece ${offset + 1}/${piecesCount}`);
				let isFinal = offset === piecesCount - 1;
				let length = FILE_CHUNK_SIZE;

				if (isFinal) {
					length = buffer.byteLength - offset * FILE_CHUNK_SIZE;
				}

				let piece = new Uint8Array(buffer, offset * FILE_CHUNK_SIZE, length);

				let encrypted = sodium.crypto_secretstream_xchacha20poly1305_push(
					state,
					piece,
					null,
					isFinal ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL : 0
				);
				pieces.push(encrypted);

				offset++;
				progress && progress((offset / piecesCount) * 100);
				if (offset < piecesCount) {
					setImmediate(chunk, 10);
				} else {
					resolve(pieces);
				}
			};

			chunk();
		});

		return promise.then((pieces) => {
			let metadata = {
				header: sodium.to_base64(header, sodium.base64_variants.ORIGINAL_NO_PADDING),
				encryptedMetadata: sodium.to_base64(metadataEncrypted, sodium.base64_variants.ORIGINAL_NO_PADDING),
			};

			return {
				pieces,
				metadata,
				key: sodium.to_base64(key, sodium.base64_variants.URLSAFE_NO_PADDING),
			};
		});
	});
};
