// Event listener for popup start button click
chrome.runtime.onMessage.addListener((request) => {
	if (request.message == 'find primers') {
		let data = retrieveData(request.params);
		if (data.exons.length > 0) {
			chrome.runtime.sendMessage({
				message: 'load results',
				data: data,
			});
		} else {
			alert('No exons found');
		}
	}
});

// Gets and returns all the necessary data from the Ensembl site
retrieveData = (params) => {
	let gene = $('title').text().split(' ')[1];
	let url = window.location.href;

	// exons is wrapped set of each exon element
	let exons = $('.bg2 .text_sequence.exon_sequence');
	// Array of exon strings
	let exonsText = [];
	exons.each(function () {
		exonsText.push(
			$(this)
				.text()
				.trim()
				.replace(/(\r\n|\n|\r)/gm, '')
		);
	});

	let lenInd = -1;
	$('#ensembl_panel_1')
		.find('.ss_header')
		.children()
		.each(function (index) {
			if ($(this).prop('title') == 'Length') {
				lenInd = index;
			}
		});
	console.log(lenInd);
	let introns = [];
	$('.bg1').each(function () {
		introns.push($(this).children()[lenInd].textContent);
	});

	return {
		gene: gene,
		url: url,
		exons: exonsText,
		introns: introns,
		params: params,
	};
};
