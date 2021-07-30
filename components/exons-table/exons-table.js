import {createExonRow, createIntronRow} from "./exons-table-factory.js";

/**
 * @param data {{
 *     	gene: string,
		url: string,
		exons: string[],
		introns: number[],
 * }}
 */
export function initializeExonsTable(data) {
    $('#ensembl-link').attr('href', data.url);
    $('#ensembl-link').text(data.gene);
    for (let index = 0; index < data.exons.length - 1; index += 1) {
        $('#exons-table-body').append(createExonRow(data.exons[index], index));
        $('#exons-table-body').append(createIntronRow(data.introns[index + 1]));
    }
    $('#exons-table-body').append(createExonRow(data.exons[data.exons.length - 1], data.exons.length - 1));
}