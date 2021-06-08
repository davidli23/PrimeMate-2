import {PrimerManager} from './js/PrimerManager.js';
import {initializePrimerList} from './components/primer-list/primer-list.js';
import {initializeExonsTable} from "./components/exons-table/exons-table.js";

const primerManager = new PrimerManager();

$(document).ready(() => {
    chrome.runtime.sendMessage({message: 'retrieve data'}, (data) => {
        primerManager.generatePrimerPairs(data.exons, data.introns, data.params);
        displayResults(data);
    });
});

let displayResults = (data) => {
    $('title').text(`Results: ${data.gene}`);
    $('#loading-row').attr('hidden', true);
    $('#results-row').attr('hidden', false);

    $('#primer-list').load('./components/primer-list/primer-list.html', () =>
        initializePrimerList(primerManager)
    );
    $('#exons-table').load('./components/exons-table/exons-table.html', () =>
        initializeExonsTable(data)
    );
};
