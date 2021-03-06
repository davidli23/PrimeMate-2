/**
 * @param primerPair {PrimerPair}
 * @param index {number}
 * @param type {string} 'all' or 'favorites
 * @returns {jQuery}
 */
export function createPrimerCard(primerPair, index, type) {
    return $(`
	<div id="primers-${type}-item-${primerPair.id}" class="accordion-item">
		<div id="primers-${type}-header-${primerPair.id}" class="accordion-header">
			<div
				class="accordion-button collapsed"
				type="button"
				data-bs-toggle="collapse"
				aria-expanded="false"
				aria-controls="primers-${type}-collapse-${primerPair.id}"
			>
				<div class="title">Primer Pair ${index}</div>
				<div class="button-group">
					<button
						class="btn copy-btn"
						data-bs-toggle="tooltip"
						data-bs-placement="top"
						data-bs-trigger="manual"
						title="Copied!"
						style="display: none;"
					>
						<img src="assets/copy.svg">
					</button>
					<button class="btn favorite-btn ${type === 'favorites' ? '' : 'not-favorite'}" style="display: none;">
						${type === 'favorites' ? '<img src="assets/star-filled.svg">' : '<img src="assets/star-empty.svg">'}
					</button>
				</div>
			</div>
		</div>
		<div
			id="primers-${type}-collapse-${primerPair.id}"
			class="accordion-collapse collapse"
			aria-labelledby="primers-${type}-header-${primerPair.id}"
			data-bs-parent="#primers-${type}-accordion"
		>
			${createPrimerBody(primerPair)}
		</div>
	</div>`);
}

function createPrimerBody(primerPair) {
    return `
	<div class="accordion-body">
		<div>
			<div class="prop-heading">
				Forward (Exon ${primerPair.fPrimer.exonNumber + 1})
			</div>
			<div class="prop-body">${primerPair.fPrimer.sequence}</div>
		</div>
		<div>
			<div class="prop-heading">Reverse (Exon ${primerPair.rPrimer.exonNumber + 1})</div>
			<div class="prop-body">${primerPair.rPrimer.sequence}</div>
		</div>
		<div>
			<div class="prop-heading">Length (bp)</div>
			<div class="prop-body">
				for: ${primerPair.fPrimer.length} | rev: ${primerPair.rPrimer.length} |
				total: ${primerPair.totalLength}
			</div>
		</div>
		<div>
			<div class="prop-heading">Melting Temp (??C) (Basic)</div>
			<div class="prop-body">
				for: ${primerPair.fPrimer.meltTemps.basic.toFixed(1)} | rev:
				${primerPair.rPrimer.meltTemps.basic.toFixed(1)} | diff:
				${primerPair.meltTempDiffs.basic.toFixed(1)}
			</div>
		</div>
		<div>
			<div class="prop-heading">Melting Temp (??C) (Salt Adjusted)</div>
			<div class="prop-body">
				for: ${primerPair.fPrimer.meltTemps.saltAdjusted.toFixed(1)} | rev:
				${primerPair.rPrimer.meltTemps.saltAdjusted.toFixed(1)} | diff:
				${primerPair.meltTempDiffs.saltAdjusted.toFixed(1)}
			</div>
		</div>
		<div>
			<div class="prop-heading">G/C Content</div>
			<div class="prop-body">
				for: ${primerPair.fPrimer.percentGC.toFixed(1)}% | rev:
				${primerPair.rPrimer.percentGC.toFixed(1)}%
			</div>
		</div>
		<div>
			<div class="prop-heading">Start/End with G/C Pair</div>
			<div class="prop-body">
				for: starts-${primerPair.fPrimer.clamps.starts},
				ends-${primerPair.fPrimer.clamps.ends}
			</div>
			<div class="prop-body">
				rev: starts-${primerPair.rPrimer.clamps.starts},
				ends-${primerPair.rPrimer.clamps.ends}
			</div>
		</div>
		<div>
			<div class="prop-heading">Hairpin</div>
			<div class="prop-body">
				for: ${primerPair.fPrimer.hairpin} | rev: ${primerPair.fPrimer.hairpin}
			</div>
		</div>
		<div>
			<div class="prop-heading">Dimerization</div>
			<div class="prop-body">${primerPair.dimerizes}</div>
		</div>
	</div>
	`;
}
