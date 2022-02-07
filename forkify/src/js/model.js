import {API_URL , RESULT_PER_PAGE , KEY} from './config.js';
import { getJSON , sendJSON } from './helper.js';

export const state = {
    recipe : {},
    search : {
        query : '',
        results : [],
        resultPerPage : RESULT_PER_PAGE,
        page : 1,
    },
    bookmark : [],
}

export const loadRecipe = async function(id){
    try{
        const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
        let {recipe} = data.data;

        state.recipe = {
          id : recipe.id,  
          title : recipe.title,
          publisher : recipe.publisher,
          sourceUrl : recipe.source_url,
          image : recipe.image_url,
          servings : recipe.servings,
          cookingTime : recipe.cooking_time,
          ingredients : recipe.ingredients
        }
        if(recipe.key) state.recipe.key = recipe.key;

        if(state.bookmark.some( b => b.id === recipe.id)){
            state.recipe.bookmark = true;
        }else{
            state.recipe.bookmark = false;
        }
    }catch(err){
        console.log(err);
        throw new Error(err);
    }
}

export const loadSearchResults = async function(query){
    try{
        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map( recipe => {
            const rp = {
                id : recipe.id,
                title : recipe.title,
                publisher : recipe.publisher,
                image : recipe.image_url,
            }
            if(recipe.key) rp.key = recipe.key;
            return rp;
        })
        // change to page 1
        state.search.page = 1;
    }catch(err){
        console.log(err.message);
        throw new Error(err);
    }
}

export const getSearchResultsPage = function(currPage = state.search.page){
    // set current page
    state.search.page = currPage;
    const start = (currPage - 1) * state.search.resultPerPage;
    const end = (currPage) * state.search.resultPerPage; 

    return state.search.results.slice(start , end);
}

export const updateServings = function(newServing){
    state.recipe.ingredients.forEach( ing => {
        // newQty = oldQty * newServing / oldServing
        ing.quantity = ing.quantity * newServing / state.recipe.servings;
    });   
    state.recipe.servings = newServing;
}

export const addBookMark = function(recipe){
    //add to bookmark
    state.bookmark.push(recipe);

    // Mark current recipe as a bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmark = true;

    // store bookmarks
    storeBookmark();
}

export const removeBookMark = function(recipe){
    state.bookmark = state.bookmark.filter( b => b.id !== recipe.id);
    
    // Mark current recipe as a un bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmark = false;

    // store bookmarks
    storeBookmark();
}

// store bookmark
const storeBookmark = function(){
    localStorage.setItem('bookmarks' , JSON.stringify(state.bookmark));
}

const init = function(){
    const bookmarks = localStorage.getItem('bookmarks');
    if(bookmarks){
        state.bookmark = JSON.parse(bookmarks);
    }
}
init();

export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe)
        .filter( ele => ele[0].startsWith('ingredient') && ele[1] !== '')
        .map( ele => {
            const ingArr = ele[1].split(',').map(ele => ele.trim());
            // const ingArr = ele[1].replaceAll(' ' , '').split(',');
            if(ingArr.length !== 3) throw new Error('Wrong ingredient fromat. use correct one!!');
            const [ quantity , unit ,  description ] = ingArr;
    
            return { quantity : quantity ? +quantity : null , unit : unit ? +unit : null , description : description ? description : null};
        });
        const recipe = {
            title : newRecipe.title,
            source_url : newRecipe.sourceUrl,
            image_url : newRecipe.image,
            publisher : newRecipe.publisher,
            cooking_time : +newRecipe.cookingTime,
            servings : +newRecipe.servings,
            ingredients,
        }
        console.log(recipe);

        const data = await sendJSON(`${API_URL}?key=${KEY}` , recipe);

        // set as current recipe
        let userRecipe = data.data.recipe;

        state.recipe = {
          id : userRecipe.id,  
          title : userRecipe.title,
          publisher : userRecipe.publisher,
          sourceUrl : userRecipe.source_url,
          image : userRecipe.image_url,
          servings : userRecipe.servings,
          cookingTime : userRecipe.cooking_time,
          ingredients : userRecipe.ingredients,
          key : userRecipe.key,
        }
    }catch(err){
        console.log(err);
        throw err;
    }
}