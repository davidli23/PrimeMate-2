/**
 * @param primerPair {PrimerPair}
 * @param index {number}
 * @returns {jQuery}
 */
export function createPrimerCard(primerPair, index) {
    return $(`
	<div class="accordion-item">
		<h2 id="primers-all-header-${index}" class="accordion-header">
			<button
				class="accordion-button collapsed"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#primers-all-collapse-${index}"
				aria-expanded="false"
				aria-controls="primers-all-collapse-${index}"
			>
				Primer Pair ${index + 1}
			</button>
		</h2>
		<div
			id="primers-all-collapse-${index}"
			class="accordion-collapse collapse"
			aria-labelledby="primers-all-header-${index}"
			data-bs-parent="#primers-all-accordion"
		>
		${createPrimerBody(primerPair)}
		</div>
	</div>`);
}

let createPrimerBody = (primerPair) => {
    return `
	<div class="accordion-body">
		<div>
			<div class="prop-heading">
				Forward (Exon ${primerPair.fPrimer.exonNumber + 1})
			</div>
			<div class="prop-body">${primerPair.fPrimer.sequence}</div>
		</div>
		<div>
			<div class="prop-heading">Reverse ${primerPair.rPrimer.exonNumber + 1}</div>
			<div class="prop-body">${primerPair.fPrimer.sequence}</div>
		</div>
		<div>
			<div class="prop-heading">Length (bp)</div>
			<div class="prop-body">
				for: ${primerPair.fPrimer.length} | rev: ${primerPair.rPrimer.length} |
				total: ${primerPair.totalLength}
			</div>
		</div>
		<div>
			<div class="prop-heading">Melting Temp (ºC) (Basic)</div>
			<div class="prop-body">
				for: ${primerPair.fPrimer.meltTemps.basic.toFixed(1)} | rev:
				${primerPair.rPrimer.meltTemps.basic.toFixed(1)} | diff:
				${primerPair.meltTempDiffs.basic.toFixed(1)}
			</div>
		</div>
		<div>
			<div class="prop-heading">Melting Temp (ºC) (Salt Adjusted)</div>
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
};
