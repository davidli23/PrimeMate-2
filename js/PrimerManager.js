import findPrimers from './primer-finder.js';

/**
 * Manager class in charge of creating, storing, and manipulating the primer pairs
 */
export default class PrimerManager {
	#allPrimerPairs;

	/**
	 * Runs algorithm that finds primer pairs and sets allPrimerPairs
	 * @param {Array} exons Array of the exons as strings
	 * @param {Array} introns Array of intron lengths
	 * @param {Object} params Params object
	 */
	generatePrimerPairs(exons, introns, params) {
		this.#allPrimerPairs = findPrimers(exons, introns, params);
	}
}
