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
      "justify-center",
      "items-center",
      "text-center",
      "hover:shadow-lg",
      "hover:translate-y-1",
      "transition",
      "duration-300",
      "ease-in-out"
    );

    const imgElement = document.createElement("img");
    imgElement.classList.add("p-5", "space-y-3", "flex-1");
    imgElement.src = image;
    imgElement.alt = character;

    const textElement = document.createElement("div");
    textElement.classList.add("p-5", "space-y-3", "flex-1");

    const quoteTextElement = document.createElement("p");
    quoteTextElement.textContent = quote;
    quoteTextElement.classList.add("self-end");

    const characterElement = document.createElement("p");
    characterElement.textContent = character;
    characterElement.classList.add("self-end");

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

  // Agregar evento al botón de búsqueda
  searchButton.addEventListener("click", () => {
    searchQuotes();
  });

  // Agregar evento 'keydown' al campo de búsqueda
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchQuotes();
    }
  });

  // Función para buscar citas por personaje, frase o número de frases
  async function searchQuotes() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    try {
      const response = await fetch(
        `https://thesimpsonsquoteapi.glitch.me/quotes?count=100` // Asumiendo un máximo de 100 citas por búsqueda
      );
      const data = await response.json();

      quoteContainer.innerHTML = ""; // Limpiar contenedor de citas

      if (!searchTerm) {
        // Si el término de búsqueda está vacío
        for (let i = 0; i < charactersPerPage; i++) {
          const { quote, character, image } = data[i];
          const articleElement = createArticleElement(quote, character, image);
          quoteContainer.appendChild(articleElement);
        }
      } else if (!isNaN(searchTerm)) {
        // Si el término de búsqueda es un número
        const characterQuotesMap = new Map();
        data.forEach((quoteData) => {
          const character = quoteData.character.toLowerCase();
          if (!characterQuotesMap.has(character)) {
            characterQuotesMap.set(character, []);
          }
          characterQuotesMap.get(character).push(quoteData);
        });

        characterQuotesMap.forEach((quotes, character) => {
          if (quotes.length === parseInt(searchTerm)) {
            quotes.forEach((quoteData) => {
              const { quote, character, image } = quoteData;
              const articleElement = createArticleElement(
                quote,
                character,
                image
              );
              quoteContainer.appendChild(articleElement);
            });
          }
        });
      } else {
        // Si el término de búsqueda no es un número y no está vacío
        data.forEach((quoteData) => {
          const { quote, character, image } = quoteData;
          if (
            character.toLowerCase().includes(searchTerm) ||
            quote.toLowerCase().includes(searchTerm)
          ) {
            const articleElement = createArticleElement(
              quote,
              character,
              image
            );
            quoteContainer.appendChild(articleElement);
          }
        });
      }
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  }
});
