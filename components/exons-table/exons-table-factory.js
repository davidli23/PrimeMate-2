/**
 * @param exon {string}
 * @param index {number}
 * @returns {jQuery}
 */
export function createExonRow(exon, index) {
    return $(`
	<tr id="exon-${index}">
		<td>${index + 1}</td>
		<td class="exon-sequence"><span>${exon}</span></td>
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
