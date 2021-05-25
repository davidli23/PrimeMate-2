$(document).ready(() => {
	chrome.runtime.sendMessage({ message: 'retrieve data' }, (data) => {
		displayResults(data);
	});
});

let displayResults = (data) => {
	$('title').text(data.gene);
};
