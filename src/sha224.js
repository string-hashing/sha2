import {get32, add32, big32} from '@arithmetic-type/uint32';

const k = [
	get32(0x42_8a_2f_98),
	get32(0x71_37_44_91),
	get32(0xb5_c0_fb_cf),
	get32(0xe9_b5_db_a5),
	get32(0x39_56_c2_5b),
	get32(0x59_f1_11_f1),
	get32(0x92_3f_82_a4),
	get32(0xab_1c_5e_d5),
	get32(0xd8_07_aa_98),
	get32(0x12_83_5b_01),
	get32(0x24_31_85_be),
	get32(0x55_0c_7d_c3),
	get32(0x72_be_5d_74),
	get32(0x80_de_b1_fe),
	get32(0x9b_dc_06_a7),
	get32(0xc1_9b_f1_74),
	get32(0xe4_9b_69_c1),
	get32(0xef_be_47_86),
	get32(0x0f_c1_9d_c6),
	get32(0x24_0c_a1_cc),
	get32(0x2d_e9_2c_6f),
	get32(0x4a_74_84_aa),
	get32(0x5c_b0_a9_dc),
	get32(0x76_f9_88_da),
	get32(0x98_3e_51_52),
	get32(0xa8_31_c6_6d),
	get32(0xb0_03_27_c8),
	get32(0xbf_59_7f_c7),
	get32(0xc6_e0_0b_f3),
	get32(0xd5_a7_91_47),
	get32(0x06_ca_63_51),
	get32(0x14_29_29_67),
	get32(0x27_b7_0a_85),
	get32(0x2e_1b_21_38),
	get32(0x4d_2c_6d_fc),
	get32(0x53_38_0d_13),
	get32(0x65_0a_73_54),
	get32(0x76_6a_0a_bb),
	get32(0x81_c2_c9_2e),
	get32(0x92_72_2c_85),
	get32(0xa2_bf_e8_a1),
	get32(0xa8_1a_66_4b),
	get32(0xc2_4b_8b_70),
	get32(0xc7_6c_51_a3),
	get32(0xd1_92_e8_19),
	get32(0xd6_99_06_24),
	get32(0xf4_0e_35_85),
	get32(0x10_6a_a0_70),
	get32(0x19_a4_c1_16),
	get32(0x1e_37_6c_08),
	get32(0x27_48_77_4c),
	get32(0x34_b0_bc_b5),
	get32(0x39_1c_0c_b3),
	get32(0x4e_d8_aa_4a),
	get32(0x5b_9c_ca_4f),
	get32(0x68_2e_6f_f3),
	get32(0x74_8f_82_ee),
	get32(0x78_a5_63_6f),
	get32(0x84_c8_78_14),
	get32(0x8c_c7_02_08),
	get32(0x90_be_ff_fa),
	get32(0xa4_50_6c_eb),
	get32(0xbe_f9_a3_f7),
	get32(0xc6_71_78_f2),
];

function cycle(state, w) {
	// Initialize hash value for this chunk:
	let a = state[0];
	let b = state[1];
	let c = state[2];
	let d = state[3];
	let e = state[4]; // eslint-disable-line unicorn/prevent-abbreviations
	let f = state[5];
	let g = state[6];
	let h = state[7];

	// Main loop:
	// for j from 0 to 63
	for (let j = 0; j < 64; ++j) {
		// S1 := (e rightrotate 6) xor (e rightrotate 11) xor (e rightrotate 25)
		const s1 =
			((e >>> 6) | (e << 26)) ^
			((e >>> 11) | (e << 21)) ^
			((e >>> 25) | (e << 7));
		// Ch := (e and f) xor ((not e) and g)
		const ch = (e & f) ^ (~e & g);
		// Temp := h + S1 + ch + k[j] + w[j]
		let temporary = add32(add32(h, s1), add32(add32(ch, k[j]), w[j]));
		// D := d + temp;
		d = add32(d, temporary);
		// S0 := (a rightrotate 2) xor (a rightrotate 13) xor (a rightrotate 22)
		const s0 =
			((a >>> 2) | (a << 30)) ^
			((a >>> 13) | (a << 19)) ^
			((a >>> 22) | (a << 10));
		// Maj := (a and (b xor c)) xor (b and c)
		const maj = (a & (b ^ c)) ^ (b & c);
		// Temp := temp + S0 + maj
		temporary = add32(add32(temporary, s0), maj);

		h = g;
		g = f;
		f = e;
		e = d;
		d = c;
		c = b;
		b = a;
		a = temporary;
	}

	// Add this chunk's hash to result so far:
	state[0] = add32(state[0], a);
	state[1] = add32(state[1], b);
	state[2] = add32(state[2], c);
	state[3] = add32(state[3], d);
	state[4] = add32(state[4], e);
	state[5] = add32(state[5], f);
	state[6] = add32(state[6], g);
	state[7] = add32(state[7], h);
}

function call(h, data, o) {
	const w = Array.from({length: 64});

	// Break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (let j = 0; j < 16; ++j) {
		w[j] = big32(data, o + j * 4);
	}

	// Extend the sixteen 32-bit words into sixty-four 32-bit words:
	// for j from 16 to 63
	for (let j = 16; j < 64; ++j) {
		// S0 := (w[j-15] rightrotate 7) xor (w[j-15] rightrotate 18) xor (w[j-15] rightshift 3)
		const s0 =
			((w[j - 15] >>> 7) | (w[j - 15] << 25)) ^
			((w[j - 15] >>> 18) | (w[j - 15] << 14)) ^
			(w[j - 15] >>> 3);
		// S1 := (w[j-2] rightrotate 17) xor (w[j-2] rightrotate 19) xor (w[j-2] rightshift 10)
		const s1 =
			((w[j - 2] >>> 17) | (w[j - 2] << 15)) ^
			((w[j - 2] >>> 19) | (w[j - 2] << 13)) ^
			(w[j - 2] >>> 10);
		// W[j] := w[j-16] + s0 + w[j-7] + s1
		w[j] = add32(add32(w[j - 16], s0), add32(w[j - 7], s1));
	}

	cycle(h, w);
}

/**
 * SHA-224
 *
 * SHA-224 is identical to SHA-256, except that:
 *  - the initial variable values h0 through h7 are different, and
 *  - the output is constructed by omitting h7.
 */
export function sha224(bytes, n, digest) {
	// PREPARE

	const q = (n / 8) | 0;
	const z = q * 8;
	const u = n - z;

	// Append the bit '1' to the message
	const last = u > 0 ? bytes[q] & (~0 << (7 - u)) : 0x80;

	// Note 1: All variables are unsigned 32 bits and wrap modulo 2^32 when calculating
	// Note 2: All constants in this pseudo code are in big endian.
	// Within each word, the most significant byte is stored in the leftmost byte position

	// Initialize state:
	const h = [
		get32(0xc1_05_9e_d8),
		get32(0x36_7c_d5_07),
		get32(0x30_70_dd_17),
		get32(0xf7_0e_59_39),
		get32(0xff_c0_0b_31),
		get32(0x68_58_15_11),
		get32(0x64_f9_8f_a7),
		get32(0xbe_fa_4f_a4),
	];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	const m = (n / 512) | 0;
	const y = ((n - 512 * m) / 8) | 0;

	// Offset in data
	let o = 0;

	// For each chunk
	for (let j = 0; j < m; ++j, o += 64) {
		call(h, bytes, o);
	}

	// Last bytes + padding + length
	let tail = [];

	// Last bytes
	for (let j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	// Special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);

	// Append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	let zeroes = ((448 - ((n + 1) % 512)) / 8) | 0;

	if (zeroes < 0) {
		// We need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (let j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}

	// Pad with zeroes
	for (let j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// Append length of message (before preparation), in bits,
	// as 64-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(
		0,
		0,
		0,
		0,
		(n >>> 24) & 0xff,
		(n >>> 16) & 0xff,
		(n >>> 8) & 0xff,
		(n >>> 0) & 0xff,
	);

	call(h, tail, 0);

	digest[0] = (h[0] >>> 24) & 0xff;
	digest[1] = (h[0] >>> 16) & 0xff;
	digest[2] = (h[0] >>> 8) & 0xff;
	digest[3] = (h[0] >>> 0) & 0xff;
	digest[4] = (h[1] >>> 24) & 0xff;
	digest[5] = (h[1] >>> 16) & 0xff;
	digest[6] = (h[1] >>> 8) & 0xff;
	digest[7] = (h[1] >>> 0) & 0xff;
	digest[8] = (h[2] >>> 24) & 0xff;
	digest[9] = (h[2] >>> 16) & 0xff;
	digest[10] = (h[2] >>> 8) & 0xff;
	digest[11] = (h[2] >>> 0) & 0xff;
	digest[12] = (h[3] >>> 24) & 0xff;
	digest[13] = (h[3] >>> 16) & 0xff;
	digest[14] = (h[3] >>> 8) & 0xff;
	digest[15] = (h[3] >>> 0) & 0xff;
	digest[16] = (h[4] >>> 24) & 0xff;
	digest[17] = (h[4] >>> 16) & 0xff;
	digest[18] = (h[4] >>> 8) & 0xff;
	digest[19] = (h[4] >>> 0) & 0xff;
	digest[20] = (h[5] >>> 24) & 0xff;
	digest[21] = (h[5] >>> 16) & 0xff;
	digest[22] = (h[5] >>> 8) & 0xff;
	digest[23] = (h[5] >>> 0) & 0xff;
	digest[24] = (h[6] >>> 24) & 0xff;
	digest[25] = (h[6] >>> 16) & 0xff;
	digest[26] = (h[6] >>> 8) & 0xff;
	digest[27] = (h[6] >>> 0) & 0xff;

	return digest;
}
