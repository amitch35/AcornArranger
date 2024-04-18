const parser = new DOMParser();
      
export function loadProperty(href, container) {
    console.log("Loading Property:", href, container);

    fetch(href)
    .then((response) => {
        if (response.status !== 200) {
        throw `Status: ${response.status}`;
        }
        return response.text();
    })
    .then((htmlString) => {
        const doc = parser.parseFromString(
        htmlString,
        "text/html"
        );

        console.log("Property Document:", doc);
        const article = doc.body.firstChild;
        container.replaceChildren(article);
    })
    .catch((error) => {
        const message = document.createTextNode(
        `Failed to fetch ${href}: ${error}`
        );

        container.append(message);
    });
}