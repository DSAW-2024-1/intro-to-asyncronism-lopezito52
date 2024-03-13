document.addEventListener("DOMContentLoaded", () => {
  const columnContainer = document.getElementById("characters");
  const loadMoreButton = document.getElementById("load");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  let offset = 0;
  const charactersPerPage = 10;

  async function loadQuotes(searchText = "") {
    columnContainer.innerHTML = "";

    try {
      let url = `https://thesimpsonsquoteapi.glitch.me/quotes?count=${charactersPerPage}&offset=${offset}`;
      if (searchText) {
        url += `&character=${searchText}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      data.forEach((quoteData) => {
        const { quote, character, image } = quoteData;
        const articleElement = document.createElement("article");
        articleElement.classList.add(
          "bg-red-100",
          "shadow",
          "rounded",
          "overflow-hidden",
          "flex",
          "flex-col",
          "hover:shadow-lg",
          "w-full"
        );

        const imgElement = document.createElement("img");
        imgElement.classList.add("p-5", "space-y-3", "flex-1");
        imgElement.src = image;
        imgElement.alt = character;

        const textElement = document.createElement("div");
        textElement.classList.add("p-5", "space-y-3", "flex-1");

        const quoteTextElement = document.createElement("p");
        quoteTextElement.textContent = quote;

        const characterElement = document.createElement("p");
        characterElement.textContent = character;

        textElement.appendChild(characterElement);
        textElement.appendChild(quoteTextElement);

        articleElement.appendChild(imgElement);
        articleElement.appendChild(textElement);

        columnContainer.appendChild(articleElement);
      });

      offset += charactersPerPage;
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  }

  loadQuotes();

  searchButton.addEventListener("click", () => {
    const searchText = searchInput.value.toLowerCase();
    loadQuotes(searchText);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const searchText = searchInput.value.toLowerCase();
      loadQuotes(searchText);
    }
  });

  loadMoreButton.addEventListener("click", () => {
    loadQuotes();
  });
});
