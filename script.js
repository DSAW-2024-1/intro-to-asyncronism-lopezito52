document.addEventListener("DOMContentLoaded", () => {
  const quoteContainer = document.getElementById("characters");
  const loadMoreButton = document.getElementById("load");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  let offset = 0;
  const charactersPerPage = 10;

  async function loadQuotes() {
    try {
      const response = await fetch(
        `https://thesimpsonsquoteapi.glitch.me/quotes?count=${charactersPerPage}&offset=${offset}`
      );
      const data = await response.json();

      data.forEach((quoteData) => {
        const { quote, character, image } = quoteData;
        const articleElement = createArticleElement(quote, character, image);
        quoteContainer.appendChild(articleElement);
      });

      offset += charactersPerPage;
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  }

  function createArticleElement(quote, character, image) {
    const articleElement = document.createElement("article");
    articleElement.classList.add(
      "bg-red-100",
      "shadow",
      "rounded",
      "overflow-hidden",
      "object-cover",
      "object-center",
      "flex",
      "flex-col",
      "hover:shadow-lg"
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

    return articleElement;
  }

  // Cargar citas al cargar la página
  loadQuotes();

  // Agregar evento al botón "Cargar más"
  loadMoreButton.addEventListener("click", () => {
    loadQuotes();
  });

  // Función para buscar citas por personaje
  function searchQuotes() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const articles = Array.from(quoteContainer.children);

    articles.forEach((article) => {
      const characterElement = article.querySelector("p:first-child");
      const characterName = characterElement.textContent.trim().toLowerCase();

      if (characterName.includes(searchTerm)) {
        article.style.display = "block";
      } else {
        article.style.display = "none";
      }
    });
  }

  // Agregar evento al botón de búsqueda
  searchButton.addEventListener("click", () => {
    searchQuotes();
  });

  // Agregar evento al campo de búsqueda
  searchInput.addEventListener("input", () => {
    searchQuotes();
  });
});
