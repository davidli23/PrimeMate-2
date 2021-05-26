var data;
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
		data = request.data;
		window.open('results.html');
	}
	if (request.message == 'retrieve data') {
		sendResponse(data);
	}
});
