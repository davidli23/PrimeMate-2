import { CONSTANTS, reverseComplement, isComplementary } from './util.js';

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
		this.clamps = Primer.#hasClamps(this.sequence);
		let content = Primer.#findGCATContent(this.sequence);
		this.percentGC = Primer.#findPercentGC(content, this.length);
		this.meltTemps = Primer.#findMeltTemps(content);
	}

	setHairpins(dimerThresh) {
		for (let lInd = 0; lInd <= this.length - 2 * dimerThresh; lInd++) {
			for (
				let rInd = lInd + dimerThresh;
				rInd <= this.sequence.length - dimerThresh;
				rInd++
			) {
				let isHairpin = true;
				for (let i = 0; i < dimerThresh; i++) {
					if (
						!isComplementary(
							this.sequence.substring(lInd + i, lInd + i + 1),
							this.sequence.substring(rInd + dimerThresh - i - 1, rInd + dimerThresh - i)
						)
					) {
						isHairpin = false;
						break;
					}
				}
				if (isHairpin) {
					this.hairpin = true;
					return;
				}
			}
		}
		this.hairpin = false;
	}

	static #hasClamps(sequence) {
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

	static #findGCATContent(sequence) {
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

	static #findPercentGC(content, length) {
		return (100 * (content.G + content.C)) / length;
	}

	static #findMeltTemps(content) {
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
