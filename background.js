var exons;
var gene;
var url;
var introns;
var params;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message == 'fetch previous params') {
		sendResponse({
			paramsAvailable: params != null,
			params: params,
		});
	}
	// if (request.message == 'send exons') {
	// 	if (request.exons.length > 0) {
	// 		exons = request.exons;
	// 		gene = request.gene;
	// 		url = request.url;
	// 		introns = request.introns;
	// 		params = request.params;
	// 		window.open('results.html');
	// 	} else {
	// 		alert('No exons found');
	// 	}
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
