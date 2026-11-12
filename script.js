const feeds = {
    general: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",

    india: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",

    world: "https://feeds.bbci.co.uk/news/world/rss.xml",

    technology: "https://feeds.bbci.co.uk/news/technology/rss.xml",

    business: "https://feeds.bbci.co.uk/news/business/rss.xml"
};

let allNews = [];

async function loadNews(category) {

    const container = document.getElementById("newsContainer");

    document.getElementById("heading").innerText =
        category.toUpperCase() + " NEWS";

    container.innerHTML = "<p>Loading news...</p>";

    try {

        const url = "https://proxy.cors.dev/" + feeds[category];

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch news");
        }

        const text = await response.text();

        const parser = new DOMParser();

        const xml = parser.parseFromString(text, "text/xml");

        const items = xml.querySelectorAll("item");

        allNews = Array.from(items).map(item => {

            const title = item.querySelector("title")?.textContent || "";

            const description =
                item.querySelector("description")?.textContent || "";

            const link = item.querySelector("link")?.textContent || "#";

            const image =
                item.querySelector("enclosure")?.getAttribute("url") ||
                item.querySelector("media\\:thumbnail")?.getAttribute("url") ||
                "https://placehold.co/600x350?text=Daily+News";

            return {
                title,
                description,
                link,
                image
            };

        });

        displayNews(allNews);

    } catch (error) {

        container.innerHTML =
            "<p>News could not be loaded. Please try again later.</p>";

        console.log(error);

    }
}

function displayNews(news) {

    const container = document.getElementById("newsContainer");

    container.innerHTML = "";

    if (news.length === 0) {
        container.innerHTML = "<p>No news found.</p>";
        return;
    }

    news.forEach(item => {

        const card = document.createElement("div");

        card.className = "news-card";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = "News image";
        image.onerror = function () {
            this.src = "https://placehold.co/600x350?text=Daily+News";
        };

        const content = document.createElement("div");
        content.className = "news-content";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const description = document.createElement("p");

        description.textContent =
            item.description.replace(/<[^>]*>/g, "").slice(0, 150);

        const link = document.createElement("a");
        link.href = item.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Read More";

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(link);

        card.appendChild(image);
        card.appendChild(content);

        container.appendChild(card);

    });
}

function searchNews() {

    const query = document.getElementById("searchInput")
        .value.toLowerCase();

    const filtered = allNews.filter(item =>
        item.title.toLowerCase().includes(query)
    );

    displayNews(filtered);
}

// Load news when website opens
loadNews("general");