/*
  MODEL: MovieRepository
  Esta classe simula uma base de dados usando localStorage.
  Se o projeto evoluir, esta seria a parte trocada por uma API ou banco real.
*/
class MovieRepository {
  constructor(storageKey = "watchlist_movies_mvvm_v2") {
    this.storageKey = storageKey;
    this.seedInitialData();
  }

  getAll() {
    const movies = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    return movies.map((movie) => new Movie(movie));
  }

  save(movieData) {
    const movie = new Movie(movieData);

    if (!movie.isValid()) {
      throw new Error("Preencha nome, ano, gênero, sinopse de até 150 caracteres e status corretamente.");
    }

    const movies = this.getAll();
    const alreadyExists = movies.some((item) => item.id === movie.id);

    if (alreadyExists) {
      const updatedMovies = movies.map((item) => (item.id === movie.id ? movie : item));
      this.persist(updatedMovies);
      return movie;
    }

    this.persist([movie, ...movies]);
    return movie;
  }

  delete(movieId) {
    const movies = this.getAll().filter((movie) => movie.id !== movieId);
    this.persist(movies);
  }

  findById(movieId) {
    return this.getAll().find((movie) => movie.id === movieId);
  }

  search({ searchTerm = "", status = "Todos" } = {}) {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return this.getAll().filter((movie) => {
      const matchesTitle = movie.title.toLowerCase().includes(normalizedTerm);
      const matchesStatus = status === "Todos" || movie.status === status;

      return matchesTitle && matchesStatus;
    });
  }

  getStats() {
    const movies = this.getAll();
    const watched = movies.filter((movie) => movie.status === "Visto").length;

    return {
      total: movies.length,
      watched,
    };
  }

  persist(movies) {
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  /*
    Dados iniciais para a tela não abrir vazia na apresentação.
    Eles aparecem apenas na primeira vez que o usuário abre o projeto.
  */
  seedInitialData() {
    const alreadyHasData = localStorage.getItem(this.storageKey);

    if (alreadyHasData) {
      return;
    }

    const initialMovies = [
      new Movie({
        title: "Ainda Estou Aqui",
        year: 2024,
        genre: "Drama",
        synopsis: "Uma história brasileira sobre memória, família e resistência durante a ditadura militar.",
        status: "Visto",
      }),
      new Movie({
        title: "Interestelar",
        year: 2014,
        genre: "Ficção científica",
        synopsis: "Astronautas viajam pelo espaço em busca de um novo lar para a humanidade.",
        status: "Não visto",
      }),
    ];

    this.persist(initialMovies);
  }
}
