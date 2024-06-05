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

const crawlPage = async currURL => {
    console.log(`crawling ${currURL}`);

    let res

    try {
        res = await fetch(currURL);
    } catch (err) {
        throw new Error(`Got network error ${err.messsage}`);
    }

    if (res.status > 399) {
        console.log(`Got http error ${res.status} ${res.statusText}`);
        return
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
       console.log(`Got non-html response: ${contentType}`);
       return
    }

    console.log(await res.text());
}

export { normalizeURL, getURLsFromHTML, crawlPage }
