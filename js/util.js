export const CONSTANTS = {
	NA_CONC: 0.05,
};

export const BOUNDS = {
	tempDiff: 5,
	indTemp: 5,
	indGCContent: 10,
	length: 20,
};

export const BLOCK_SIZE = 20;

/**
 * Determines if two bases are complementary
 * @param b1 {string} Base 1
 * @param b2 {string} Base 2
 * @returns {boolean} If they are complementary
 */
export function isComplementary(b1, b2) {
	return (
		(b1 === 'C' && b2 === 'G') ||
		(b1 === 'G' && b2 === 'C') ||
		(b1 === 'A' && b2 === 'T') ||
		(b1 === 'T' && b2 === 'A')
	);
}

/**
 * @param {string} sequence
 * @returns {string} Reverse complement of the sequence
 */
export function reverseComplement(sequence) {
	let arr = new Array(sequence.length);
	for (let i = 0; i < sequence.length; i++) {
		switch (sequence.substring(i, i + 1)) {
			case 'C':
				arr[sequence.length - 1 - i] = 'G';
				break;
			case 'G':
				arr[sequence.length - 1 - i] = 'C';
				break;
			case 'A':
				arr[sequence.length - 1 - i] = 'T';
				break;
			case 'T':
				arr[sequence.length - 1 - i] = 'A';
				break;
		}
	}
	return arr.join('');
}

/**
 * Assigns a value from 0 to 1 that represents how close a value is to its ideal value
 * @param {number} value Actual value
 * @param {number} ideal Ideal value
 * @param {number} bound Size of range around ideal value
 * @returns
 */
export function purity(value, ideal, bound) {
	// Normal distr
	//SD = bound / 2;
	//return Math.exp(-0.5 * Math.pow((value - ideal) / SD, 2));

	// Linear
	return Math.max(-1 * Math.abs((value - ideal) / bound) + 1, 0);
}


export function hasClamps(sequence) {
	return {
		starts:
			(sequence.charAt(0) === 'G' || sequence.charAt(0) === 'C') &&
			(sequence.charAt(1) === 'G' || sequence.charAt(1) === 'C'),
		ends:
			(sequence.charAt(sequence.length - 2) === 'G' ||
				sequence.charAt(sequence.length - 2) === 'C') &&
			(sequence.charAt(sequence.length - 1) === 'G' ||
				sequence.charAt(sequence.length - 1) === 'C'),
	};
}

export function findGCATContent(sequence) {
	let content = {
		G: 0,
		C: 0,
		A: 0,
		T: 0,
	};
	for (let base of sequence) {
		content[base] += 1;
	}
	return content;
}

export function findPercentGC(content, length) {
	return (100 * (content.G + content.C)) / length;
}

export function findMeltTemps(content) {
	return {
		basic:
			64.9 +
			(41 * (content.G + content.C - 16.4)) /
			(content.A + content.T + content.G + content.C),
		saltAdjusted:
			100.5 +
			(41 * (content.G + content.C)) /
			(content.A + content.T + content.G + content.C) -
			820 / (content.A + content.T + content.G + content.C) +
			16.6 * Math.log10(CONSTANTS.NA_CONC),
	};
}