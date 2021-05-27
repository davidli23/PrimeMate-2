import Primer from './Primer.js';

export default class PrimerPair {
	id;
	favorite;
	distance;
	totalLength;
	dimerizes;
	meltTempDiffs;
	score;
	fPrimer;
	rPrimer;

	constructor(id, exons, exonNumber, fLocation, rLocation) {
		this.id = id;
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
		// this.score = this.#findScores();
	}

	#findScores() {
		let tempDiffBound = 5;
		let indTempBound = 5;
		let lengthBound = 20;
		let GCContentBound = 10;
		if (params.temperature.type == 'Basic') {
			this.tempDiffScore = purity(this.meltTempDiffBasic, 0, tempDiffBound);
			this.indMeltTempScore =
				(purity(this.fMeltTempBasic, params.temperature.ideal, indTempBound) +
					purity(this.rMeltTempBasic, params.temperature.ideal, indTempBound)) /
				2;
		} else if (params.temperature.type == 'Salt Adjusted') {
			this.tempDiffScore = purity(this.meltTempDiffSalt, 0, tempDiffBound);
			this.indMeltTempScore =
				(purity(this.fMeltTempSalt, params.temperature.ideal, indTempBound) +
					purity(this.rMeltTempSalt, params.temperature.ideal, indTempBound)) /
				2;
		}
		this.indGCContentScore = 0;
		this.lengthScore = purity(
			this.dist + this.rLen + this.fLen,
			params.length.total,
			lengthBound
		);
		this.clampScore = 0;

		if (
			this.fPercentGC >= params.percentGC.lower &&
			this.fPercentGC <= params.percentGC.upper
		) {
			this.indGCContentScore += 0.5;
		} else {
			this.indGCContentScore +=
				purity(
					Math.min(
						this.fPercentGC,
						params.percentGC.lower + params.percentGC.upper - this.fPercentGC
					),
					params.percentGC.lower,
					GCContentBound
				) / 2;
		}
		if (
			this.rPercentGC >= params.percentGC.lower &&
			this.rPercentGC <= params.percentGC.upper
		) {
			this.indGCContentScore += 0.5;
		} else {
			this.indGCContentScore +=
				purity(
					Math.min(
						this.rPercentGC,
						params.percentGC.lower + params.percentGC.upper - this.rPercentGC
					),
					GCContentBound
				) / 2;
		}

		if (this.fClamps.starts) {
			this.clampScore += 0.25;
		}
		if (this.fClamps.ends) {
			this.clampScore += 0.25;
		}
		if (this.rClamps.starts) {
			this.clampScore += 0.25;
		}
		if (this.rClamps.ends) {
			this.clampScore += 0.25;
		}

		return (
			weights.tempDiff * this.tempDiffScore +
			weights.indMeltTemp * this.indMeltTempScore +
			weights.indGCContent * this.indGCContentScore +
			weights.length * this.lengthScore +
			weights.clamps * this.clampScore
		);
	}
}
