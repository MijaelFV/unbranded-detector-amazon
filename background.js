let active_tab_id = 0;

chrome.tabs.onActivated.addListener((tab) => {
	chrome.tabs.get(tab.tabId, (current_tab_info) => {
		active_tab_id = tab.tabId;

		if (
			/^https:\/\/www\.amazon/.test(current_tab_info.url) ||
			/^https:\/\/members\.junglescout\.com\//.test(current_tab_info.url)
		) {
			chrome.tabs.insertCSS(null, { file: './styles.css' });
			chrome.tabs.executeScript(null, { file: './foreground.js' }, () =>
				console.log('script injected')
			);
		}
	});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'detect') {
		console.log('sent to foreground');
		chrome.tabs.sendMessage(active_tab_id, {
			message: 'start',
		});
	}
});
