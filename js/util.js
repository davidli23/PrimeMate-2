export const CONSTANTS = {
	NA_CONC: 0.05,
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
