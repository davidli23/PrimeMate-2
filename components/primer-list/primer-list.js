import {createPrimerCard} from "./primer-list-factory.js";

/**
 * @param primerManager {PrimerManager}
 */
export function initializePrimerList(primerManager) {
	while(!primerManager.allBlocksGenerated) {
		let block = primerManager.generateNextBlock();
		block.array.forEach((primerPair, index) => {
			$('#primers-all-accordion').append(createPrimerCard(primerPair, block.startIndex + index + 1, 'all'));
			setSelectAction(primerPair.id, 'all', primerManager);
			setFavoriteButton(primerManager, primerPair, block.startIndex + index + 1);
		});
	}
	setTabSwitchAction(primerManager);
}

/**
 * @param id {number}
 * @param type {string}
 * @param primerManager {PrimerManager}
 */
function setSelectAction(id, type, primerManager) {
	const headerButton = $(`#primers-${type}-header-${id} .accordion-button`);
	const collapsible = $(`#primers-${type}-collapse-${id}`);
	headerButton.click(function () {
		if (!collapsible.hasClass('collapsing')) {
			if (headerButton.hasClass('collapsed')) {
				selectPrimerPair(id, type, primerManager);
			}
			else {
				deselectPrimerPair(id, type, primerManager);
			}
		}
	});
}

/**
 * @param id {number}
 * @param type {string}
 * @param primerManager {PrimerManager}
 */
function selectPrimerPair(id, type, primerManager) {
	if (primerManager.selectedPrimerPair >= 0) {
		$(`#primers-${type}-header-${primerManager.selectedPrimerPair} .accordion-button`).addClass('collapsed');
	}
	$(`#primers-${type}-header-${id} .accordion-button`).removeClass('collapsed');
	$(`#primers-${type}-collapse-${id}`).collapse('show');
	removeHighlight(primerManager);
	primerManager.selectedPrimerPair = id;
	highlightPrimerPair(primerManager);
}

/**
 * @param id {number}
 * @param type {string}
 * @param primerManager {PrimerManager}
 */
function deselectPrimerPair(id, type, primerManager) {
	$(`#primers-${type}-header-${id} .accordion-button`).addClass('collapsed');
	$(`#primers-${type}-collapse-${id}`).collapse('hide');
	removeHighlight(primerManager);
	primerManager.selectedPrimerPair = -1;
}

/**
 * @param primerManager {PrimerManager}
 */
function highlightPrimerPair(primerManager) {
	const splitExons = primerManager.splitSelectedExons();
	$(`#exon-${splitExons.forward.exon} .exon-sequence`).html(`
		<span>${splitExons.forward.segments[0]}</span><span class="highlighted">${splitExons.forward.segments[1]}</span><span>${splitExons.forward.segments[2]}</span>
	`);
	$(`#exon-${splitExons.reverse.exon} .exon-sequence`).html(`
		<span>${splitExons.reverse.segments[0]}</span><span class="highlighted">${splitExons.reverse.segments[1]}</span><span>${splitExons.reverse.segments[2]}</span>
	`);
}

function removeHighlight(primerManager) {
	if (primerManager.selectedPrimerPair >= 0) {
		const splitExons = primerManager.joinSelectedExons();
		$(`#exon-${splitExons.forward.exon} .exon-sequence`).html(`
		<span>${splitExons.forward.sequence}</span>
	`);
		$(`#exon-${splitExons.reverse.exon} .exon-sequence`).html(`
		<span>${splitExons.reverse.sequence}</span>
	`);
	}
}

/**
 * @param primerManager {PrimerManager}
 * @param primerPair {PrimerPair}
 * @param index {number}
 */
function setFavoriteButton(primerManager, primerPair, index) {
	$(`#primers-all-item-${primerPair.id} .favorite-btn`).click(function (event) {
		event.stopPropagation();
		if (!primerManager.favorites.has(primerPair.id)) {
			addFavorite(primerManager, primerPair, index);
		} else {
			removeFavorite(primerPair.id, primerManager);
		}
	});
}

function addFavorite(primerManager, primerPair, index) {
	const favoriteButton = $(`#primers-all-item-${primerPair.id} .favorite-btn`)
	favoriteButton.children().first().replaceWith('<img src="assets/star-filled.svg">');
	primerManager.favorites.add(primerPair.id);
	$('#primers-favorites-accordion').append(createPrimerCard(primerPair, index, 'favorites'));
	$(`#primers-favorites-item-${primerPair.id} .favorite-btn`).click(function () {
		removeFavorite(primerPair.id, primerManager);
		removeHighlight(primerManager);
	});
	favoriteButton.removeClass('not-favorite');
	setSelectAction(primerPair.id, 'favorites', primerManager);
}

function removeFavorite(id, primerManager) {
	const favoriteButton = $(`#primers-all-item-${id} .favorite-btn`);
	favoriteButton.children().first().replaceWith('<img src="assets/star-empty.svg">');
	primerManager.favorites.delete(id);
	$(`#primers-favorites-item-${id}`).remove();
	favoriteButton.addClass('not-favorite');
}

/**
 * @param primerManager {PrimerManager}
 */
function setTabSwitchAction(primerManager) {
	$('#primers-favorites-tab').click(function () {
		if (primerManager.selectedPrimerPair >= 0) {
			deselectPrimerPair(primerManager.selectedPrimerPair, 'all', primerManager);
		}
	});
	$('#primers-all-tab').click(function () {
		if (primerManager.selectedPrimerPair >= 0) {
			deselectPrimerPair(primerManager.selectedPrimerPair, 'favorites', primerManager);
		}
	});
}