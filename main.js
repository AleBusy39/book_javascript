// Selezione degli elementi DOM
const searchButton = document.getElementById("search-button");
const categoryInput = document.getElementById("category-input");
const booksList = document.getElementById("books-list");

// Funzione per chiamare l'API dei libri
const fetchBooks = async (category) => {
  try {
    const response = await axios.get(`https://openlibrary.org/subjects/${category}.json`);
    return response.data.works;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

// Funzione per ottenere la descrizione di un libro
const fetchBookDescription = async (bookKey) => {
  try {
    const response = await axios.get(`https://openlibrary.org${bookKey}.json`);
    return response.data.description || "No description available.";
  } catch (error) {
    console.error("Error fetching book description:", error);
    return "No description available.";
  }
};

// Mostra i libri nell'elenco con contenitore per descrizione
const displayBooks = (books) => {
  booksList.innerHTML = ""; // Svuota l'elenco
  books.forEach((book) => {
    // Crea l'elemento del libro
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";
    bookItem.textContent = `${book.title} by ${book.authors.map((a) => a.name).join(", ")}`;

    // Crea il contenitore della descrizione, inizialmente vuoto
    const descriptionContainer = document.createElement("div");
    descriptionContainer.className = "description-container";
    descriptionContainer.style.display = "none"; // Nascondi inizialmente

    // Aggiungi evento clic per visualizzare la descrizione
    bookItem.addEventListener("click", async () => {
      // Se la descrizione è già visibile, chiudi il contenitore
      if (descriptionContainer.style.display === "block") {
        descriptionContainer.style.display = "none";
        descriptionContainer.textContent = "";
      } else {
        // Altrimenti, carica e mostra la descrizione
        const description = await fetchBookDescription(book.key);
        descriptionContainer.textContent = description;
        descriptionContainer.style.display = "block";
      }
    });

    // Aggiungi il libro e la descrizione alla lista
    booksList.appendChild(bookItem);
    booksList.appendChild(descriptionContainer);
  });
};

// Gestisce il click del bottone di ricerca
searchButton.addEventListener("click", async () => {
  const category = categoryInput.value.trim();
  booksList.innerHTML = "";
  if (category) {
    const books = await fetchBooks(category);
    displayBooks(books);
  } else {
    alert("Please enter a category.");
  }
});
