// const first = document.createElement('button');
// first.innerText = "SET DATA";
// first.id = "first";

// const second = document.createElement('button');
// second.innerText = "SHOUTOUT TO BACKEND";
// second.id = "second";

// document.querySelector('body').appendChild(first);
// document.querySelector('body').appendChild(second);

// first.addEventListener('click', () => {
//     chrome.storage.local.set({ "password": "123" });
//     console.log("I SET DATA");
// });

// second.addEventListener('click', () => {
//     chrome.runtime.sendMessage({message: 'yo check the storage'});
//     console.log('I SENT THE MESSAGE')
// });

// const detectButton = document.getElementById('#detect');
// detectButton.addEventListener('click', function () {
// 	console.log('click detect 1');
// 	naziProcess();
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'start') {
		naziProcess();
	}
});

function naziProcess() {
	console.log('executed');
	let result;
	if (document.URL.includes('junglescout')) {
		result = document.querySelectorAll('[aria-label="View on Amazon"]');
	} else {
		result = document.querySelectorAll('h2 > a');
	}

	if (result) {
		console.log('products', result);
		result.forEach(processLink);
	}
}

function processLink(element) {
	const link = element.getAttribute('href');
	if (!link) return;

	let url = '';

	const isJungleScout = link?.includes('amazon');
	if (isJungleScout) {
		url = 'https://corsproxy.io/?' + encodeURIComponent(link);
	} else {
		url = `https://www.amazon.com${link}`;
	}

	console.log('link', link);
	fetch(url)
		.then((response) => {
			console.log('response', response);
			return response.text();
		})
		.then((html) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const random = doc.querySelector('div');
			console.log('elemento random', random);
			const brandEl = doc.querySelector('#bylineInfo');
			console.log('brandElement', brandEl);
			const brandText = brandEl?.textContent;
			console.log('brandText', brandText);
			const brandIsRegistered = brandText?.includes('Brand');

			if (brandIsRegistered) {
				const warningEl = doc.createElement('h3');
				warningEl.textContent = 'Unbranded';
				warningEl.classList.add('unbranded');
				console.log('adding warning', element);
				if (isJungleScout) {
					element.appendChild(warningEl);
				} else {
					element.closest('div').appendChild(warningEl);
					// element.parentElement.appendChild(warningEl);
				}
			}
		})
		.catch((error) => {
			console.log('Error al obtener el contenido de la página:', error);
		});
}
