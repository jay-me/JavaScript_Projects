import icons from 'url:../img/icons.svg';
import * as modal from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_TIME } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


// key - 652c7418-3871-425a-852c-e58e3488c360

// url - https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886?key=652c7418-3871-425a-852c-e58e3488c360
///////////////////////////////////////

// if(module.hot){
//   module.hot.accept();
// }



const showRecipe = async function () {
  try {

    // getting id from hash
    const id = window.location.hash.slice(1);

    if(!id) return;
    // loading spinner
    recipeView.renderSpinner();
    
    // update active class for this recipe
    resultView.update(modal.getSearchResultsPage(1));
    bookmarkView.update(modal.state.bookmark);

    // loading recipe
    await modal.loadRecipe(id);

    // rendering recipe
    recipeView.render(modal.state.recipe);
    
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
}

const controlSearchResult = async function(){
  try {
    const query = searchView.getQuery();
    if(!query) return;

    // loading sppiner
    resultView.renderSpinner();

    // calling API
    await modal.loadSearchResults(query);

    // render data
    resultView.render(modal.getSearchResultsPage(1));

    // render pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.log(err);
    resultView.renderError();
  }
}

const handlePagination = function(gotoPage){
  try {
    // loading sppiner
    resultView.renderSpinner();
    // render data
    resultView.render(modal.getSearchResultsPage(gotoPage));
    // render pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.log(err);
    resultView.renderError();
  }
}

const controlServing = function (newServing){
  // update serving
  modal.updateServings(newServing);
  
  ////// update view /////

  // rendering recipe
  // recipeView.render(modal.state.recipe);
  recipeView.update(modal.state.recipe);

}

const controlAddBookmark = function(){

  // 1. add or remove bookmark
  if(modal.state.recipe.bookmark) 
    modal.removeBookMark(modal.state.recipe);
  else  
    modal.addBookMark(modal.state.recipe);
  // 2. update view
  recipeView.update(modal.state.recipe);
  // 3. render bookmark
  bookmarkView.render(modal.state.bookmark);
}

const controlAddRecipe = async function(newRecipe){
  try{
    // render spinner
    addRecipeView.renderSpinner();
    // console.log(newRecipe);
    await modal.uploadRecipe(newRecipe);

    // add to bookmark
    controlAddBookmark(modal.state.recipe);
    // render recipe
    recipeView.render(modal.state.recipe);

    // success message
    addRecipeView.renderError("Successfully added your Recipe");

    //  change id in url
    window.history.pushState(null , '' , `#${modal.state.recipe.id}`);

    // close the form
    setTimeout( function(){
      addRecipeView.toggleWindow();
    } , MODAL_CLOSE_TIME * 1000)
    // console.log(modal.state.recipe);
  }catch(err){
    console.log(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  recipeView.addEventHandler(showRecipe);
  searchView.addHandleSearch(controlSearchResult);
  paginationView.addHandleClick(handlePagination);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.handleBookmark(controlAddBookmark);
  bookmarkView.render(modal.state.bookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
