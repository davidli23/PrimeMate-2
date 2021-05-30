import { Primer } from './Primer.js';
import { purity } from './util.js';

export class PrimerPair {
	id;
	favorite;
	distance;
	totalLength;
	dimerizes;
	meltTempDiffs;
	scores;
	fPrimer;
	rPrimer;

	constructor(exons, exonNumber, fLocation, rLocation) {
		this.favorite = false;
		this.dimerizes = false;
		this.fPrimer = new Primer(exons[exonNumber], exonNumber, fLocation, false);
		this.rPrimer = new Primer(
			exons[exonNumber + 1],
			exonNumber + 1,
			rLocation,
			true
		);
		this.distance = exons[exonNumber].length - fLocation.end + rLocation.start;
		this.totalLength =
			this.distance + this.fPrimer.length + this.rPrimer.length;
		this.meltTempDiffs = {
			basic: Math.abs(
				this.fPrimer.meltTemps.basic - this.rPrimer.meltTemps.basic
			),
			saltAdjusted: Math.abs(
				this.fPrimer.meltTemps.saltAdjusted -
					this.rPrimer.meltTemps.saltAdjusted
			),
		};
	}

	setId(id) {
		this.id = id;
	}

	calculateScores(params, bounds, weights) {
		let tempDiffScore = this.#findTempDiffScore(params, bounds.tempDiff);
		let indMeltTempScore = this.#findIndMeltTempScore(params, bounds.indTemp);
		let GCContentScore = this.#findGCContentScore(params, bounds.indGCContent);
		let lengthScore = this.#findLengthScore(params, bounds.length);
		let clampsScore = this.#findClampsScore();

		this.scores = {
			tempDiff: tempDiffScore,
			indMeltTemp: indMeltTempScore,
			GCContent: GCContentScore,
			length: lengthScore,
			clamps: clampsScore,
			total:
				weights.tempDiff * tempDiffScore +
				weights.indMeltTemp * indMeltTempScore +
				weights.GCContent * GCContentScore +
				weights.length * lengthScore +
				weights.clamps * clampsScore,
		};
	}

	#findClampsScore() {
		let score = 0;
		if (this.fPrimer.clamps.starts) {
			score += 0.25;
		}
		if (this.fPrimer.clamps.ends) {
			score += 0.25;
		}
		if (this.rPrimer.clamps.starts) {
			score += 0.25;
		}
		if (this.rPrimer.clamps.ends) {
			score += 0.25;
		}
		return score;
	}

	#findGCContentScore(params, GCContentBound) {
		let score = 0;
		if (
			this.fPrimer.percentGC >= params.percentGC.lower &&
			this.fPrimer.percentGC <= params.percentGC.upper
		) {
			score += 0.5;
		} else {
			score +=
				purity(
					Math.min(
						this.fPrimer.percentGC,
						params.percentGC.lower +
							params.percentGC.upper -
							this.fPrimer.percentGC
					),
					params.percentGC.lower,
					GCContentBound
				) / 2;
		}
		if (
			this.rPrimer.percentGC >= params.percentGC.lower &&
			this.rPrimer.percentGC <= params.percentGC.upper
		) {
			score += 0.5;
		} else {
			score +=
				purity(
					Math.min(
						this.rPrimer.percentGC,
						params.percentGC.lower +
							params.percentGC.upper -
							this.rPrimer.percentGC
					),
					params.percentGC.lower,
					GCContentBound
				) / 2;
		}
		return score;
	}

	#findLengthScore(params, lengthBound) {
		return purity(this.totalLength, params.length.total, lengthBound);
	}

	#findTempDiffScore(params, tempDiffBound) {
		if (params.temperature.type == 'basic') {
			return purity(this.meltTempDiffs.basic, 0, tempDiffBound);
		} else if (params.temperature.type == 'salt-adjusted') {
			return purity(this.meltTempDiffs.saltAdjusted, 0, tempDiffBound);
		}
	}

	#findIndMeltTempScore(params, indTempBound) {
		if (params.temperature.type == 'basic') {
			return (
				(purity(
					this.fPrimer.meltTemps.basic,
					params.temperature.ideal,
					indTempBound
				) +
					purity(
						this.rPrimer.meltTemps.basic,
						params.temperature.ideal,
						indTempBound
					)) /
				2
			);
		} else if (params.temperature.type == 'salt-adjusted') {
			return (
				(purity(
					this.fPrimer.meltTemps.saltAdjusted,
					params.temperature.ideal,
					indTempBound
				) +
					purity(
						this.rPrimer.meltTemps.saltAdjusted,
						params.temperature.ideal,
						indTempBound
					)) /
				2
			);
		}
	}
}
