import findPrimers from './primer-finder.js';
import { BOUNDS } from './util.js';

/**
 * Manager class in charge of creating, storing, and manipulating the primer pairs
 */
export default class PrimerManager {
	weights;

	#allPrimerPairs;

	/**
	 * Runs algorithm that finds primer pairs and sets allPrimerPairs
	 * @param {Array} exons Array of the exons as strings
	 * @param {Array} introns Array of intron lengths
	 * @param {Object} params Params object
	 */
	generatePrimerPairs(exons, introns, params) {
		this.weights = {
			tempDiff: 20,
			indMeltTemp: 20,
			GCContent: 20,
			length: 20,
			clamps: 20,
		};
		this.#allPrimerPairs = findPrimers(
			exons,
			introns,
			params,
			BOUNDS,
			this.weights
		);
	}
}
