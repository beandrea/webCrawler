import { JSDOM } from 'jsdom'

const normalizeURL = url => {
    const urlObj = new URL(url);
    let fullPath = `${urlObj.host}${urlObj.pathname}`;

    if (fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1);
    }

    return fullPath;
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

const fetchHTML = async url => {
    let res
    try {
        res = await fetch(url);
    } catch (err) {
        throw new Error(`got network err: ${err.message}`);
    }

    if (res.status > 399) {
        throw new Error(`got http error: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')){
        throw new Error(`got non html response: ${contentType}`);
    }

    return res.text();
}

const crawlPage = async (baseURL, currURL = baseURL, pages = {}) => {
    const currURL_Obj = new URL(currURL);
    const baseURL_Obj = new URL(baseURL);

    if (currURL_Obj.hostname !== baseURL_Obj.hostname) {
        return pages;
    }

    const normalizedURL = normalizeURL(currURL);

    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++;
        return pages;
    }

    pages[normalizedURL] = 1;
    console.log(`crawling ${currURL}`);
    let html = '';

    try {
        html = await fetchHTML(currURL);
    } catch (err) {
        console.log(`${err.message}`);
        return pages;
    }

    const embedded_URLs = getURLsFromHTML(html, baseURL);
    for (const embedded_URL of embedded_URLs) {
        pages = await crawlPage(baseURL, embedded_URL, pages);
    }

    return pages;
}

export { normalizeURL, getURLsFromHTML, crawlPage }
