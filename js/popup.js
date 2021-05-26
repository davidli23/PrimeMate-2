$(document).ready(() => {
	// Checks if there are previous options
	chrome.runtime.sendMessage(
		{ message: 'fetch previous params' },
		(response) => {
			if (response.paramsAvailable) {
				fillInputs(response.params);
				updateFindPrimersButton();
			}
		}
	);

	// Check if input is valid on each input change
	$('input').change(() => {
		updateFindPrimersButton();
	});

	// When find primers button is clicked
	$('#find-primers-button').click(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				message: 'find primers',
				params: getParams(),
			});
			window.close();
		});
	});
});

/**
 * Fills in with inputs from previous session (if any)
 * @param {Object} params Parameters from the previos session (see getParams for structure)
 */
let fillInputs = (params) => {
	$('#input-length-lb').val(params.length.lower);
	$('#input-length-ub').val(params.length.upper);
	$('#input-total-len').val(params.length.total);
	$('#input-percent-lb').val(params.percentGC.lower);
	$('#input-percent-ub').val(params.percentGC.upper);
	$('#input-temp-type').val(params.temperature.type);
	$('#input-temp-ideal').val(params.temperature.ideal);
	$('#input-dimer-threshold').val(params.dimerThresh);
	$('#input-exonOne').prop('checked', params.exonOneChecked);
};

/**
 * Parses user inputs and creates param object
 * @returns {Object} Object containing all the parameters
 */
let getParams = () => {
	return {
		length: {
			lower: parseInt($('#input-length-lb').val()),
			upper: parseInt($('#input-length-ub').val()),
			total: parseInt($('#input-total-len').val()),
		},
		percentGC: {
			lower: parseFloat($('#input-percent-lb').val()),
			upper: parseFloat($('#input-percent-ub').val()),
		},
		temperature: {
			type: $('#input-temp-type').val(),
			ideal: parseFloat($('#input-temp-ideal').val()),
		},
		dimerThresh: parseInt($('#input-dimer-threshold').val()),
		exonOneChecked: $('#input-exonOne').prop('checked'),
	};
};

/**
 * Determines whether params are valid
 * @param {Object} params User parameters
 * @returns {boolean} If the parameters are valid
 */
let validParams = (params) => {
	if (
		isNaN(params.length.lower) ||
		isNaN(params.length.upper) ||
		isNaN(params.length.total) ||
		isNaN(params.percentGC.lower) ||
		isNaN(params.percentGC.upper) ||
		isNaN(params.temperature.ideal) ||
		isNaN(params.dimerThresh)
	) {
		return false;
	}
	if (params.length.upper < params.length.lower) {
		return false;
	}
	if (params.length.total < params.length.lower * 2) {
		return false;
	}
	if (params.percentGC.upper < params.percentGC.lower) {
		return false;
	}
	return true;
};

/**
 * Enables or disables the find primers button based on validity of inputs
 */
let updateFindPrimersButton = () => {
	if (validParams(getParams())) {
		$('#find-primers-button').prop('disabled', false);
	} else {
		$('#find-primers-button').prop('disabled', true);
	}
};
