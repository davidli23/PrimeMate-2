var exons;
var gene;
var url;
var introns;
var params = {
	length: {
		lower: 18,
		upper: 24,
		total: 100,
	},
	percentGC: {
		lower: 40,
		upper: 60,
	},
	temperature: {
		type: 'salt-adjusted',
		ideal: 60,
	},
	dimerThresh: 5,
	exonOneChecked: false,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message == 'fetch previous params') {
		sendResponse({
			paramsAvailable: params != null,
			params: params,
		});
	}
	if (request.message == 'load results') {
		window.open('results.html');
		chrome.runtime.sendMessage({
			messsage: 'pass data to results',
			data: request.data,
		});
	}
	// }
	// if (request.message == 'get exons') {
	// 	sendResponse({
	// 		exons: exons,
	// 		gene: gene,
	// 		url: url,
	// 		introns: introns,
	// 		params: params,
	// 	});
	// }
});
