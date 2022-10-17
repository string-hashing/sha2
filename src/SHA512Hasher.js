import {copy} from '@array-like/copy';
import {NotImplementedError} from '@failure-abstraction/error';

import {sha512InitialState, sha512Call, sha512Finalize} from './sha512.js';

export class SHA512Hasher {
	constructor() {
		this._state = sha512InitialState();
		this._totalBits = 0;
		this._buffer = new Uint8Array(128);
		this._bufferBits = 0;
	}

	update(bytes, offset = 0, length = bytes.length - offset) {
		if ((this._bufferBits & 0xf_ff) !== 0) {
			throw new NotImplementedError('Cannot add bytes to bits (for now).');
		}

		this._totalBits += length << 3;

		const bufferBytes = this._bufferBits >> 3;

		if (bufferBytes > 0) {
			const bufferComplement = 128 - bufferBytes;

			if (length < bufferComplement) {
				// Buffer is not full
				copy(bytes, offset, offset + length, this._buffer, bufferBytes);
				this._bufferBits += length << 3;
				return this;
			}

			// Pad buffer with head of bytes and process it
			copy(bytes, offset, offset + bufferComplement, this._buffer, bufferBytes);
			sha512Call(this._state, this._buffer, 0);
			this._bufferBits = 0;
			offset += bufferComplement;
			length -= bufferComplement;
		}

		const fullBlocks = length >> 7;

		for (let i = 0; i < fullBlocks; ++i) {
			sha512Call(this._state, bytes, offset);
			offset += 128;
			length -= 128;
		}

		copy(bytes, offset, offset + length, this._buffer, 0);
		this._bufferBits = length << 3;
		return this;
	}

	digest(digest) {
		return sha512Finalize(
			this._buffer,
			this._totalBits,
			digest,
			this._bufferBits >> 3,
			0,
			this._bufferBits,
			this._state,
		);
	}
}
