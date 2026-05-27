/*
  VIEWMODEL: MovieViewModel
  O ViewModel é a ponte do MVVM.
  Ele guarda o estado que a tela precisa mostrar e expõe ações para a View chamar.
  Ele não manipula HTML diretamente e não conhece os elementos da tela.
*/
class MovieViewModel {
  constructor(repository) {
    this.repository = repository;
    this.listeners = [];
    this.state = {
      movies: [],
      stats: {
        total: 0,
        watched: 0,
      },
      filters: {
        searchTerm: "",
        status: "Todos",
      },
      editingMovie: null,
      feedback: "",
    };

    this.renderCatalog();
  }

  /*
    Ligação simples no estilo Observer:
    a View se inscreve no ViewModel e recebe o estado atualizado sempre que algo muda.
  */
  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.getState());
  }

  notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  getState() {
    return {
      ...this.state,
      stats: { ...this.state.stats },
      filters: { ...this.state.filters },
    };
  }

  handleSubmit(movieData) {
    try {
      this.repository.save(movieData);
      this.state.editingMovie = null;
      this.state.feedback = "";
      this.renderCatalog(this.state.filters);
      return true;
    } catch (error) {
      this.state.feedback = error.message;
      this.notify();
      return false;
    }
  }

  prepareEdit(movieId) {
    const movie = this.repository.findById(movieId);

    if (!movie) {
      this.state.feedback = "Filme não encontrado para edição.";
      this.notify();
      return;
    }

    this.state.editingMovie = movie;
    this.state.feedback = "";
    this.notify();
  }

  cancelEdit() {
    this.state.editingMovie = null;
    this.state.feedback = "";
    this.notify();
  }

  deleteMovie(movieId) {
    this.repository.delete(movieId);
    this.renderCatalog(this.state.filters);
  }

  updateFilters(filters) {
    this.state.filters = filters;
    this.renderCatalog(filters);
  }

  renderCatalog(filters = {}) {
    const currentFilters = {
      ...this.state.filters,
      ...filters,
    };

    this.state.filters = currentFilters;
    this.state.movies = this.repository.search(currentFilters);
    this.state.stats = this.repository.getStats();
    this.notify();
  }
}
