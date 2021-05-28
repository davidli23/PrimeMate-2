export const CONSTANTS = {
	NA_CONC: 0.05,
};

export const BOUNDS = {
	tempDiff: 5,
	indTemp: 5,
	indGCContent: 10,
	length: 20,
};

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
