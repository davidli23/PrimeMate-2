import PrimerManager from '/js/PrimerManager.js';

var primerManager = new PrimerManager();

$(document).ready(() => {
	chrome.runtime.sendMessage({ message: 'retrieve data' }, (data) => {
		primerManager.generatePrimerPairs(data.exons, data.introns, data.params);
		displayResults(data.gene);
	});
});

let displayResults = (gene) => {
	$('title').text('Results: ' + gene);
};
