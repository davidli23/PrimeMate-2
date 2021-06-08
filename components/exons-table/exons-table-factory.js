/**
 * @param exon {string}
 * @param index {number}
 * @returns {jQuery}
 */
export function createExonRow(exon, index) {
    return $(`
	<tr>
		<td>${index}</td>
		<td class="exon-sequence">${exon}</td>
	</tr>
	`);
}

/**
 * @param length {number}
 * @returns {jQuery}
 */
export function createIntronRow(length) {
    return $(`
	<tr>
		<td></td>
		<td>Intron (length: ${length})</td>
	</tr>
	`);
};
