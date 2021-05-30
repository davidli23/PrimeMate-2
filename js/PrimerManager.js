import { BOUNDS } from './util.js';
import { PrimerPair } from './PrimerPair.js';

/**
 * Manager class in charge of creating, storing, and manipulating the primer pairs
 */
export class PrimerManager {
	weights = {
		tempDiff: 20,
		indMeltTemp: 20,
		GCContent: 20,
		length: 20,
		clamps: 20,
	};
	scoreBounds = BOUNDS;

	#allPrimerPairs;

	/**
	 * Runs algorithm that finds primer pairs and sets allPrimerPairs
	 * @param {Array} exons Array of the exons as strings
	 * @param {Array} introns Array of intron lengths
	 * @param {Object} params Params object
	 */
	generatePrimerPairs(exons, introns, params) {
		this.#allPrimerPairs = this.#findPrimers(exons, introns, params);
		console.log(this.#allPrimerPairs);
	}

	/**
	 * Main algorithm for finding primers
	 * @param {Array} exons Array of the exons as strings
	 * @param {Array} introns Array of intron lengths
	 * @param {Object} params Params object
	 * @param {Object} bounds Bounds used for scoring
	 * @param {Object} weights Weights used for scoring
	 * @returns {Array} Array of PrimerPair objects sorted from highest score to lowest score
	 */
	#findPrimers(exons, introns, params) {
		let distBounds = {
			min: Math.floor(
				(params.length.total - params.length.upper - params.length.lower) / 2
			),
			max: Math.ceil(
				(3 *
					(params.length.total - params.length.upper - params.length.lower)) /
					2
			),
		};
		// Array of potential primer pairs
		let primerPairs = [];
		// Loop through each exon
		let i = 0;
		exons.forEach((exon, exonNumber) => {
			// Check if first or last exon
			// if (
			// 	(1 <= exonNumber && exonNumber < exons.length - 1) ||
			// 	(exons.length <= 3 && exonNumber == 0)
			// ) {
			if (
				(1 <= exonNumber && exonNumber < 2) ||
				(exons.length <= 3 && exonNumber == 0)
			) {
				// Loop through each starting index, taking the best pair with that starting index
				for (
					let fStart = Math.max(
						0,
						exon.length - distBounds.max - params.length.upper
					);
					fStart <= exon.length - params.length.lower;
					fStart++
				) {
					let primerPair = this.#bestPrimerPair(
						exons,
						exonNumber,
						fStart,
						params,
						distBounds
					);
					if (primerPair != null) {
						primerPairs.push(primerPair);
						primerPair.setId(i++);
					}
				}
			}
		});
		primerPairs.sort((p1, p2) => {
			return p2.scores.total - p1.scores.total;
		});
		return primerPairs;
	}

	#bestPrimerPair(exons, exonNumber, fStart, params, distBounds) {
		let bestPrimerPair = null;
		let bestScore = 0;

		// Loop through each possible primer pair
		for (
			let fEnd = fStart + params.length.lower;
			fEnd <= Math.min(exons[exonNumber].length, fStart + params.length.upper);
			fEnd++
		) {
			for (
				let rStart = Math.max(
					0,
					distBounds.min - (exons[exonNumber].length - fEnd)
				);
				rStart <
				Math.min(
					exons[exonNumber + 1].length - params.length.lower,
					distBounds.max - (exons[exonNumber].length - fEnd) + 1
				);
				rStart++
			) {
				for (
					let rEnd = rStart + params.length.lower;
					rEnd <=
					Math.min(exons[exonNumber + 1].length, rStart + params.length.upper);
					rEnd++
				) {
					let primerPair = new PrimerPair(
						exons,
						exonNumber,
						{ start: fStart, end: fEnd },
						{ start: rStart, end: rEnd }
					);
					primerPair.calculateScores(params, this.scoreBounds, this.weights);
					if (primerPair.scores.total > bestScore) {
						bestPrimerPair = primerPair;
						bestScore = primerPair.scores.total;
					}
				}
			}
		}
		return bestPrimerPair;
	}
}
