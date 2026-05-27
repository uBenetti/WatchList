/*
  Ponto de entrada da aplicação.
  Aqui juntamos as três partes do MVP:
  - Model/Repository: dados e regras
  - View: tela passiva
  - Presenter: coordenação da lógica de apresentação
*/
document.addEventListener("DOMContentLoaded", () => {
  const repository = new MovieRepository();
  const view = new MovieView();

  new MoviePresenter(repository, view);
});
