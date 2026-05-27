/*
  VIEW: MovieView
  A View cuida da tela.
  Ela lê campos, escuta cliques e desenha os cards no HTML.
  Ela não decide regras de negócio, não salva dados diretamente e delega as ações ao Presenter.
*/
class MovieView {
  constructor() {
    this.form = document.querySelector("#movieForm");
    this.movieIdInput = document.querySelector("#movieId");
    this.titleInput = document.querySelector("#title");
    this.yearInput = document.querySelector("#year");
    this.genreInput = document.querySelector("#genre");
    this.synopsisInput = document.querySelector("#synopsis");
    this.statusInput = document.querySelector("#status");
    this.feedback = document.querySelector("#formFeedback");
    this.submitButton = document.querySelector("#submitButton");
    this.cancelEditButton = document.querySelector("#cancelEditButton");
    this.searchInput = document.querySelector("#searchInput");
    this.statusFilter = document.querySelector("#statusFilter");
    this.movieList = document.querySelector("#movieList");
    this.totalMovies = document.querySelector("#totalMovies");
    this.watchedMovies = document.querySelector("#watchedMovies");
  }

  bindSubmit(handler) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      handler(this.getFormData());
    });
  }

  bindCancelEdit(handler) {
    this.cancelEditButton.addEventListener("click", handler);
  }

  bindSearch(handler) {
    const runSearch = () => handler(this.getFilters());

    this.searchInput.addEventListener("input", runSearch);
    this.statusFilter.addEventListener("change", runSearch);
  }

  bindEdit(handler) {
    this.movieList.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-action='edit']");

      if (editButton) {
        handler(editButton.dataset.id);
      }
    });
  }

  bindDelete(handler) {
    this.movieList.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-action='delete']");

      if (deleteButton) {
        handler(deleteButton.dataset.id);
      }
    });
  }

  getFormData() {
    return {
      id: this.movieIdInput.value,
      title: this.titleInput.value,
      year: this.yearInput.value,
      genre: this.genreInput.value,
      synopsis: this.synopsisInput.value,
      status: this.statusInput.value,
    };
  }

  getFilters() {
    return {
      searchTerm: this.searchInput.value,
      status: this.statusFilter.value,
    };
  }

  fillForm(movie) {
    this.movieIdInput.value = movie.id;
    this.titleInput.value = movie.title;
    this.yearInput.value = movie.year;
    this.genreInput.value = movie.genre;
    this.synopsisInput.value = movie.synopsis;
    this.statusInput.value = movie.status;
    this.submitButton.textContent = "Atualizar filme";
    this.cancelEditButton.classList.remove("hidden");
    this.clearFeedback();
    this.titleInput.focus();
  }

  resetForm() {
    this.form.reset();
    this.movieIdInput.value = "";
    this.submitButton.textContent = "Salvar filme";
    this.cancelEditButton.classList.add("hidden");
    this.clearFeedback();
  }

  showFeedback(message) {
    this.feedback.textContent = message;
  }

  clearFeedback() {
    this.feedback.textContent = "";
  }

  renderStats(stats) {
    this.totalMovies.textContent = stats.total;
    this.watchedMovies.textContent = stats.watched;
  }

  renderMovies(movies) {
    if (movies.length === 0) {
      this.movieList.innerHTML = `<p class="empty-state">Nenhum filme encontrado.</p>`;
      return;
    }

    this.movieList.innerHTML = movies.map((movie) => this.createMovieCard(movie)).join("");
  }

  createMovieCard(movie) {
    const statusClass = movie.status === "Visto" ? "movie-card__status--watched" : "";

    return `
      <article class="movie-card">
        <div>
          <h3 class="movie-card__title">${this.escapeHTML(movie.title)}</h3>
          <p class="movie-card__meta">${movie.year} • ${this.escapeHTML(movie.genre)}</p>
          <p class="movie-card__synopsis">${this.escapeHTML(movie.synopsis)}</p>

          <div class="movie-card__footer">
            <button class="movie-card__action-button" type="button" data-action="edit" data-id="${movie.id}">Editar</button>
            <button class="movie-card__action-button movie-card__action-button--danger" type="button" data-action="delete" data-id="${movie.id}">Excluir</button>
          </div>
        </div>

        <div class="movie-card__side">
          <span class="movie-card__status ${statusClass}">${this.escapeHTML(movie.status)}</span>
        </div>
      </article>
    `;
  }

  /*
    Proteção simples para evitar que textos digitados pelo usuário sejam
    interpretados como HTML dentro dos cards.
  */
  escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}
