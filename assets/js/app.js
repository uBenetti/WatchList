/*
  Ponto de entrada da aplicação.
  Aqui juntamos as três partes do MVC:
  - Model/Repository: dados e regras
  - View: tela
  - Controller: coordenação
*/
document.addEventListener("DOMContentLoaded", () => {
  const repository = new MovieRepository();
  const view = new MovieView();

  new MovieController(repository, view);
});
