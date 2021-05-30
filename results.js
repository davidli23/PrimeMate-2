import { PrimerManager } from './js/PrimerManager.js';

var primerManager = new PrimerManager();

$(document).ready(() => {
	chrome.runtime.sendMessage({ message: 'retrieve data' }, (data) => {
		primerManager.generatePrimerPairs(data.exons, data.introns, data.params);
		displayResults(data);
	});
});

let displayResults = (data) => {
	$('title').text(`Results: ${data.gene}`);
	$('#loading-row').attr('hidden', true);
	$('#results-row').attr('hidden', false);

	$('#side-panel').load('./side-panel.html');
};
