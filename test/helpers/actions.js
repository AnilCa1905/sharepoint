/**
 *  Exports
 */
export function jsClick($element) {
	return browser.executeScript('arguments[0].click();', $element);
}
export async function scrollAndClick($element, timeout = 10000) {
	await $element.scrollIntoView({block: 'center'});
	await $element.waitForClickable({timeout: timeout});
	await $element.click();
	await browser.pause(1000);
}

/**
 * Method to wait until new tab is opened
 * @param {Array} handlesBefore
 * @param {string} timeout
 */
export async function waitForNewTab(handlesBefore, timeout = 20000) {
	await browser.waitUntil(
		async () => {
			const handlesNow = await browser.getWindowHandles();
			return handlesNow.length > handlesBefore.length;
		},
		{
			timeout,
			timeoutMsg: 'New tab did not open within timeout',
		}
	);
}