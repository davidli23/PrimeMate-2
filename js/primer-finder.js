import PrimerPair from './PrimerPair.js';

/**
 * Main algorithm for finding primers
 * @param {Array} exons Array of the exons as strings
 * @param {Array} introns Array of intron lengths
 * @param {Object} params Params object
 * @param {Object} bounds Bounds used for scoring
 * @param {Object} weights Weights used for scoring
 * @returns {Array} Array of PrimerPair objects sorted from highest score to lowest score
 */
export default function findPrimers(exons, introns, params, bounds, weights) {
	let primerPair = new PrimerPair(
		31,
		exons,
		2,
		{ start: 3, end: 14 },
		{ start: 5, end: 18 }
	);
	primerPair.calculateScores(params, bounds, weights);
	console.log(primerPair);
	return [primerPair];
}
