import Primer from './Primer.js';
import PrimerPair from './PrimerPair.js';

/**
 * Main algorithm for finding primers
 * @param {Array} exons Array of the exons as strings
 * @param {Array} introns Array of intron lengths
 * @param {Object} params Params object
 * @returns {Array} Array of PrimerPair objects sorted from highest score to lowest score
 */
export default function findPrimers(exons, introns, params) {
	console.log(
		new Primer('GACCTCGTATAAGTCGGTATC', 2, { start: 5, end: 15 }, false)
	);
	console.log(
		new PrimerPair(31, exons, 2, { start: 3, end: 14 }, { start: 5, end: 18 })
	);
	return [];
}
