import {
	get64,
	add64,
	and64,
	xor64,
	rotr64,
	not64,
	big64,
	shr64,
} from '@arithmetic-type/uint64';

// Initialize table of round constants
// (first 64 bits of the fractional parts of the cube roots of the first 80 primes 2..311):
const k = [
	get64(0x42_8a_2f_98, 0xd7_28_ae_22),
	get64(0x71_37_44_91, 0x23_ef_65_cd),
	get64(0xb5_c0_fb_cf, 0xec_4d_3b_2f),
	get64(0xe9_b5_db_a5, 0x81_89_db_bc),
	get64(0x39_56_c2_5b, 0xf3_48_b5_38),
	get64(0x59_f1_11_f1, 0xb6_05_d0_19),
	get64(0x92_3f_82_a4, 0xaf_19_4f_9b),
	get64(0xab_1c_5e_d5, 0xda_6d_81_18),
	get64(0xd8_07_aa_98, 0xa3_03_02_42),
	get64(0x12_83_5b_01, 0x45_70_6f_be),
	get64(0x24_31_85_be, 0x4e_e4_b2_8c),
	get64(0x55_0c_7d_c3, 0xd5_ff_b4_e2),
	get64(0x72_be_5d_74, 0xf2_7b_89_6f),
	get64(0x80_de_b1_fe, 0x3b_16_96_b1),
	get64(0x9b_dc_06_a7, 0x25_c7_12_35),
	get64(0xc1_9b_f1_74, 0xcf_69_26_94),
	get64(0xe4_9b_69_c1, 0x9e_f1_4a_d2),
	get64(0xef_be_47_86, 0x38_4f_25_e3),
	get64(0x0f_c1_9d_c6, 0x8b_8c_d5_b5),
	get64(0x24_0c_a1_cc, 0x77_ac_9c_65),
	get64(0x2d_e9_2c_6f, 0x59_2b_02_75),
	get64(0x4a_74_84_aa, 0x6e_a6_e4_83),
	get64(0x5c_b0_a9_dc, 0xbd_41_fb_d4),
	get64(0x76_f9_88_da, 0x83_11_53_b5),
	get64(0x98_3e_51_52, 0xee_66_df_ab),
	get64(0xa8_31_c6_6d, 0x2d_b4_32_10),
	get64(0xb0_03_27_c8, 0x98_fb_21_3f),
	get64(0xbf_59_7f_c7, 0xbe_ef_0e_e4),
	get64(0xc6_e0_0b_f3, 0x3d_a8_8f_c2),
	get64(0xd5_a7_91_47, 0x93_0a_a7_25),
	get64(0x06_ca_63_51, 0xe0_03_82_6f),
	get64(0x14_29_29_67, 0x0a_0e_6e_70),
	get64(0x27_b7_0a_85, 0x46_d2_2f_fc),
	get64(0x2e_1b_21_38, 0x5c_26_c9_26),
	get64(0x4d_2c_6d_fc, 0x5a_c4_2a_ed),
	get64(0x53_38_0d_13, 0x9d_95_b3_df),
	get64(0x65_0a_73_54, 0x8b_af_63_de),
	get64(0x76_6a_0a_bb, 0x3c_77_b2_a8),
	get64(0x81_c2_c9_2e, 0x47_ed_ae_e6),
	get64(0x92_72_2c_85, 0x14_82_35_3b),
	get64(0xa2_bf_e8_a1, 0x4c_f1_03_64),
	get64(0xa8_1a_66_4b, 0xbc_42_30_01),
	get64(0xc2_4b_8b_70, 0xd0_f8_97_91),
	get64(0xc7_6c_51_a3, 0x06_54_be_30),
	get64(0xd1_92_e8_19, 0xd6_ef_52_18),
	get64(0xd6_99_06_24, 0x55_65_a9_10),
	get64(0xf4_0e_35_85, 0x57_71_20_2a),
	get64(0x10_6a_a0_70, 0x32_bb_d1_b8),
	get64(0x19_a4_c1_16, 0xb8_d2_d0_c8),
	get64(0x1e_37_6c_08, 0x51_41_ab_53),
	get64(0x27_48_77_4c, 0xdf_8e_eb_99),
	get64(0x34_b0_bc_b5, 0xe1_9b_48_a8),
	get64(0x39_1c_0c_b3, 0xc5_c9_5a_63),
	get64(0x4e_d8_aa_4a, 0xe3_41_8a_cb),
	get64(0x5b_9c_ca_4f, 0x77_63_e3_73),
	get64(0x68_2e_6f_f3, 0xd6_b2_b8_a3),
	get64(0x74_8f_82_ee, 0x5d_ef_b2_fc),
	get64(0x78_a5_63_6f, 0x43_17_2f_60),
	get64(0x84_c8_78_14, 0xa1_f0_ab_72),
	get64(0x8c_c7_02_08, 0x1a_64_39_ec),
	get64(0x90_be_ff_fa, 0x23_63_1e_28),
	get64(0xa4_50_6c_eb, 0xde_82_bd_e9),
	get64(0xbe_f9_a3_f7, 0xb2_c6_79_15),
	get64(0xc6_71_78_f2, 0xe3_72_53_2b),
	get64(0xca_27_3e_ce, 0xea_26_61_9c),
	get64(0xd1_86_b8_c7, 0x21_c0_c2_07),
	get64(0xea_da_7d_d6, 0xcd_e0_eb_1e),
	get64(0xf5_7d_4f_7f, 0xee_6e_d1_78),
	get64(0x06_f0_67_aa, 0x72_17_6f_ba),
	get64(0x0a_63_7d_c5, 0xa2_c8_98_a6),
	get64(0x11_3f_98_04, 0xbe_f9_0d_ae),
	get64(0x1b_71_0b_35, 0x13_1c_47_1b),
	get64(0x28_db_77_f5, 0x23_04_7d_84),
	get64(0x32_ca_ab_7b, 0x40_c7_24_93),
	get64(0x3c_9e_be_0a, 0x15_c9_be_bc),
	get64(0x43_1d_67_c4, 0x9c_10_0d_4c),
	get64(0x4c_c5_d4_be, 0xcb_3e_42_b6),
	get64(0x59_7f_29_9c, 0xfc_65_7e_2a),
	get64(0x5f_cb_6f_ab, 0x3a_d6_fa_ec),
	get64(0x6c_44_19_8c, 0x4a_47_58_17),
];

export function sha512Cycle(state, w) {
	// Initialize hash value for this chunk:
	let a = state[0];
	let b = state[1];
	let c = state[2];
	let d = state[3];
	let e = state[4];
	let f = state[5];
	let g = state[6];
	let h = state[7];

	// Main loop:
	// for j from 0 to 79
	for (let j = 0; j < 80; ++j) {
		// S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
		const s1 = xor64(xor64(rotr64(e, 14), rotr64(e, 18)), rotr64(e, 41));
		// Ch := (e and f) xor ((not e) and g)
		const ch = xor64(and64(e, f), and64(not64(e), g));
		// Temp := h + S1 + ch + k[j] + w[j]
		let temporary = add64(add64(h, s1), add64(add64(ch, k[j]), w[j]));
		// D := d + temp;
		d = add64(d, temporary);
		// S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
		const s0 = xor64(xor64(rotr64(a, 28), rotr64(a, 34)), rotr64(a, 39));
		// Maj := (a and (b xor c)) xor (b and c)
		const maj = xor64(and64(a, xor64(b, c)), and64(b, c));
		// Temp := temp + S0 + maj
		temporary = add64(add64(temporary, s0), maj);

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
	state[0] = add64(state[0], a);
	state[1] = add64(state[1], b);
	state[2] = add64(state[2], c);
	state[3] = add64(state[3], d);
	state[4] = add64(state[4], e);
	state[5] = add64(state[5], f);
	state[6] = add64(state[6], g);
	state[7] = add64(state[7], h);
}

export function sha512Call(h, data, o) {
	console.debug('sha512Call', {h, data, o});
	const w = Array.from({length: 80});

	// Break chunk into sixteen 64-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (let j = 0; j < 16; ++j) {
		w[j] = big64(data, o + j * 8);
	}

	// Extend the sixteen 64-bit words into 80 64-bit words:
	// for j from 16 to 79
	for (let j = 16; j < 80; ++j) {
		// S0 := (w[j-15] rightrotate 1) xor (w[j-15] rightrotate 8) xor (w[j-15] rightshift 7)
		const s0 = xor64(
			xor64(rotr64(w[j - 15], 1), rotr64(w[j - 15], 8)),
			shr64(w[j - 15], 7),
		);
		// S1 := (w[j-2] rightrotate 19) xor (w[j-2] rightrotate 61) xor (w[j-2] rightshift 6)
		const s1 = xor64(
			xor64(rotr64(w[j - 2], 19), rotr64(w[j - 2], 61)),
			shr64(w[j - 2], 6),
		);
		// W[j] := w[j-16] + s0 + w[j-7] + s1
		w[j] = add64(add64(w[j - 16], s0), add64(w[j - 7], s1));
	}

	sha512Cycle(h, w);
}

export function sha512InitialState() {
	console.debug('sha512InitialState');
	// (first 64 bits of the fractional parts of the square roots of the first 8 primes 2..19):
	return [
		get64(0x6a_09_e6_67, 0xf3_bc_c9_08),
		get64(0xbb_67_ae_85, 0x84_ca_a7_3b),
		get64(0x3c_6e_f3_72, 0xfe_94_f8_2b),
		get64(0xa5_4f_f5_3a, 0x5f_1d_36_f1),
		get64(0x51_0e_52_7f, 0xad_e6_82_d1),
		get64(0x9b_05_68_8c, 0x2b_3e_6c_1f),
		get64(0x1f_83_d9_ab, 0xfb_41_bd_6b),
		get64(0x5b_e0_cd_19, 0x13_7e_21_79),
	];
}

export function sha512Finalize(bytes, n, digest, y, o, right, h) {
	console.debug('sha512Finalize', {bytes, n, digest, y, o, right, h});
	// Last bytes + padding + length
	let tail = [];

	// Last bytes
	for (let j = 0; j < y; ++j) {
		tail.push(bytes[o + j]);
	}

	const q = (right / 8) | 0;
	const z = q * 8;
	const u = right - z;

	// Append the bit '1' to the message
	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	const last = u > 0 ? bytes[q] & (~0 << (7 - u)) : 0x80;
	tail.push(last);

	// Append 0 ≤ k < 1024 bits '0', so that the resulting
	// message length (in bits) is congruent to 896 (mod 1024)
	const g = 896 - ((n + 1) % 1024);
	let zeroes = (g / 8) | 0;

	if (g < 0) {
		// We need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (let j = 0; j < -zeroes; ++j) {
			tail.push(0);
		}

		sha512Call(h, tail, 0);

		zeroes = 896 / 8;
		tail = [];
	}

	// Pad with zeroes
	for (let j = 0; j < zeroes; ++j) {
		tail.push(0);
	}

	// Append length of message (before preparation), in bits,
	// as 128-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 124) & 0xff);
	// tail.push((n >>> 116) & 0xff);
	// tail.push((n >>> 108) & 0xff);
	// tail.push((n >>> 96) & 0xff);
	// tail.push((n >>> 88) & 0xff);
	// tail.push((n >>> 80) & 0xff);
	// tail.push((n >>> 72) & 0xff);
	// tail.push((n >>> 64) & 0xff);
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		(n >>> 24) & 0xff,
		(n >>> 16) & 0xff,
		(n >>> 8) & 0xff,
		(n >>> 0) & 0xff,
	);

	sha512Call(h, tail, 0);

	for (let i = 0, j = 0; j < 8; ++j) {
		digest[i] = (h[j][0] >>> 24) & 0xff;
		++i;
		digest[i] = (h[j][0] >>> 16) & 0xff;
		++i;
		digest[i] = (h[j][0] >>> 8) & 0xff;
		++i;
		digest[i] = (h[j][0] >>> 0) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 24) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 16) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 8) & 0xff;
		++i;
		digest[i] = (h[j][1] >>> 0) & 0xff;
		++i;
	}

	return digest;
}

/**
 * SHA-512
 */
export function sha512(bytes, n, digest) {
	// Note 1: All variables are unsigned 64 bits and wrap modulo 2^64 when calculating
	// Note 2: All constants in this pseudo code are big endian

	// Initialize state
	const h = sha512InitialState();

	// Process the message in successive 1024-bit chunks:
	// break message into 1024-bit chunks
	const m = (n / 1024) | 0;

	// Offset in data
	let o = 0;

	// For each chunk
	for (let j = 0; j < m; ++j, o += 128) {
		sha512Call(h, bytes, o);
	}

	const y = ((n - 1024 * m) / 8) | 0;

	return sha512Finalize(bytes, n, digest, y, o, n, h);
}
