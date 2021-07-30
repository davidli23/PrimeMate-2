import {createPrimerCard} from "./primer-list-factory.js";

/**
 * @param primerManager {PrimerManager}
 */
export function initializePrimerList(primerManager) {
	while(!primerManager.allBlocksGenerated) {
		let block = primerManager.generateNextBlock();
		block.array.forEach((primerPair, index) => {
			$('#primers-all-accordion').append(createPrimerCard(primerPair, block.startIndex + index + 1, 'all'));
			setFavoriteButton(primerManager, primerPair, block.startIndex + index + 1);
		});
	}
}

/**
 * @param primerManager {PrimerManager}
 * @param primerPair {PrimerPair}
 * @param index {number}
 */
function setFavoriteButton(primerManager, primerPair, index) {
	$(`#primers-all-item-${primerPair.id} .favorite-btn`).click(function () {
		if (!$(this).hasClass('is-favorite')) {
			$(this).addClass('is-favorite');
			$(this).children().first().replaceWith('<img src="assets/star-filled.svg">');
			primerManager.addFavorite(primerPair.id);
			$('#primers-favorites-accordion').append(createPrimerCard(primerPair, index, 'favorites'));
			$(`#primers-favorites-item-${primerPair.id} .favorite-btn`).click(function () {
				removeFavorite(primerPair.id, primerManager);
			});
		} else {
			removeFavorite(primerPair.id, primerManager);
		}
	});
}

const removeFavorite = function(id, primerManager) {
	const favButton = $(`#primers-all-item-${id} .favorite-btn`);
	favButton.removeClass('is-favorite');
	favButton.children().first().replaceWith('<img src="assets/star-empty.svg">');
	primerManager.removeFavorite(id);
	$(`#primers-favorites-item-${id}`).remove();
}