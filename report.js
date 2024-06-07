const printReport = pages => {
    console.log(`Starting report`);

    let sortedPages = sortPages(pages);
    for (let page of sortedPages) {
        const url = page[0];
        const cnt = page[1];
        
        console.log(`Found ${cnt} internal links to ${url}`);
    }
}

const sortPages = pages => {
    const pageArray = Object.entries(pages);

    pageArray.sort((firstPage, secondPage) => {
        if (secondPage[1] === firstPage[1]){
            return firstPage[0].localeCompare(secondPage[0]);
        }
        return secondPage[1] - firstPage[1];
    });

    return pageArray;
}

export { printReport, sortPages };
