/*
  Ponto de entrada da aplicação.
  Aqui juntamos as três partes do MVVM:
  - Model/Repository: dados e regras
  - View: tela e eventos do HTML
  - ViewModel: estado da tela e lógica de apresentação
*/
document.addEventListener("DOMContentLoaded", () => {
  const repository = new MovieRepository();
  const viewModel = new MovieViewModel(repository);

  new MovieView(viewModel);
});
