import {
	reverseComplement,
	isComplementary,
	hasClamps,
	findGCATContent,
	findPercentGC,
	findMeltTemps
} from './util.js';

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
		this.clamps = hasClamps(this.sequence);
		let content = findGCATContent(this.sequence);
		this.percentGC = findPercentGC(content, this.length);
		this.meltTemps = findMeltTemps(content);
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
}
