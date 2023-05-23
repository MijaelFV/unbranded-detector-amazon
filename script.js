const detectButton = document.getElementById('detect');
detectButton.addEventListener('click', () => {
	chrome.runtime.sendMessage({ message: 'detect' });
});
