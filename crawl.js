import { JSDOM } from 'jsdom'

const normalizeURL = (url) => {
    const urlObj = new URL(url);
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

const getURLsFromHTML = (htmlBody, baseURL) => {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const anchors = dom.window.document.querySelectorAll('a');

    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href');

            try {
                href = new URL(href, baseURL).href;
                urls.push(href);
            } catch (err) {
                console.log(`${err.message}: ${href}`);
            }
        }
    }

    return urls;
}

export { normalizeURL, getURLsFromHTML }
