import { CONSTANTS, reverseComplement } from './util.js';

export class Primer {
	sequence;
	originalSequence;
	exonNumber;
	location;
	length;
	clamps;
	percentGC;
	meltTemps;
	hairpin;

	constructor(exonSequence, exonNumber, location, isReverse) {
		this.originalSequence = exonSequence.substring(
			location.start,
			location.end
		);
		this.sequence = isReverse
			? reverseComplement(this.originalSequence)
			: this.originalSequence;
		this.exonNumber = exonNumber;
		this.location = location;
		this.length = location.end - location.start;
		this.clamps = this.#hasClamps(this.sequence);
		let content = this.#findGCATContent(this.sequence);
		this.percentGC = this.#findPercentGC(content, this.length);
		this.meltTemps = this.#findMeltTemps(content);
		this.hairpin = false;
	}

	/**
	 * TODO: implement
	 */
	hasHairpin() {}

	#hasClamps(sequence) {
		return {
			starts:
				(sequence.charAt(0) == 'G' || sequence.charAt(0) == 'C') &&
				(sequence.charAt(1) == 'G' || sequence.charAt(1) == 'C'),
			ends:
				(sequence.charAt(sequence.length - 2) == 'G' ||
					sequence.charAt(sequence.length - 2) == 'C') &&
				(sequence.charAt(sequence.length - 1) == 'G' ||
					sequence.charAt(sequence.length - 1) == 'C'),
		};
	}

	#findGCATContent(sequence) {
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

	#findPercentGC(content, length) {
		return (100 * (content.G + content.C)) / length;
	}

	#findMeltTemps(content) {
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
}
