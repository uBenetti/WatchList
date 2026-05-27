/*
  PRESENTER: MoviePresenter
  O Presenter é a ponte do MVP.
  Ele recebe ações da View, chama o Model e depois pede para a View atualizar a tela.
  A View continua cuidando apenas do HTML, enquanto o Presenter concentra a lógica de apresentação.
*/
class MoviePresenter {
  constructor(repository, view) {
    this.repository = repository;
    this.view = view;

    this.view.bindSubmit((movieData) => this.handleSubmit(movieData));
    this.view.bindCancelEdit(() => this.cancelEdit());
    this.view.bindSearch((filters) => this.renderCatalog(filters));
    this.view.bindEdit((movieId) => this.prepareEdit(movieId));
    this.view.bindDelete((movieId) => this.deleteMovie(movieId));

    this.renderCatalog();
  }

  handleSubmit(movieData) {
    try {
      this.repository.save(movieData);
      this.view.resetForm();
      this.renderCatalog(this.view.getFilters());
    } catch (error) {
      this.view.showFeedback(error.message);
    }
  }

  prepareEdit(movieId) {
    const movie = this.repository.findById(movieId);

    if (!movie) {
      this.view.showFeedback("Filme não encontrado para edição.");
      return;
    }

    this.view.fillForm(movie);
  }

  cancelEdit() {
    this.view.resetForm();
  }

  deleteMovie(movieId) {
    const wantsToDelete = confirm("Deseja excluir este filme da watchlist?");

    if (!wantsToDelete) {
      return;
    }

    this.repository.delete(movieId);
    this.renderCatalog(this.view.getFilters());
  }

  renderCatalog(filters = {}) {
    const movies = this.repository.search(filters);
    const stats = this.repository.getStats();

    this.view.renderStats(stats);
    this.view.renderMovies(movies);
  }
}
