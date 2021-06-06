import {createPrimerCard} from "./primer-list-factory.js";

/**
 * @param primerManager {PrimerManager}
 */
export function initializePrimerList(primerManager) {
	while(!primerManager.allBlocksGenerated) {
		let block = primerManager.generateNextBlock();
		block.array.forEach((primerPair, index) => {
			$('#primers-all-accordion').append(createPrimerCard(primerPair, block.startIndex + index));
		});
	}
}