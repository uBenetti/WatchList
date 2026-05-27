/*
  MODEL: Movie
  Esta classe representa um filme dentro da Watchlist.
  Ela não sabe nada sobre HTML, botões, formulários ou eventos de clique.
  A responsabilidade dela é guardar os dados e validar regras simples.
*/
class Movie {
  constructor({ id, title, year, genre, synopsis, status, createdAt }) {
    this.id = id || crypto.randomUUID();
    this.title = title.trim();
    this.year = Number(year);
    this.genre = genre;
    this.synopsis = (synopsis || "").trim();
    this.status = status;
    this.createdAt = createdAt || new Date().toISOString();
  }

  /*
    Regra de negócio simples:
    para um filme existir no catálogo, ele precisa ter título, ano válido,
    gênero, sinopse curta e um dos dois status permitidos.
  */
  isValid() {
    const currentYearLimit = 2027;
    const firstMovieYear = 1888;
    const synopsisLimit = 150;
    const acceptedStatus = ["Não visto", "Visto"];

    return (
      this.title.length > 0 &&
      Number.isInteger(this.year) &&
      this.year >= firstMovieYear &&
      this.year <= currentYearLimit &&
      this.genre.length > 0 &&
      this.synopsis.length > 0 &&
      this.synopsis.length <= synopsisLimit &&
      acceptedStatus.includes(this.status)
    );
  }
}
