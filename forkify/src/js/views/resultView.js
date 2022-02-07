import View from "./View";
import icons from 'url:../../img/icons.svg';

class ResultView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = "No recipe Found, Try other one!!";
    _message = '';

    _generateMarkup(){
        let markup = '';
        const id = window.location.hash.slice(1);
        this._data.forEach( recipe => {
            markup += `<li class="preview">
            <a class="preview__link ${ id === recipe.id ? 'preview__link--active' : ''}" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}.</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                  <div class="preview__user-generated ${recipe.key ? '' : 'hidden' }">
                    <svg>
                      <use href="${icons.split('?')[0]}#icon-user"></use>
                    </svg>
                  </div>
              </div>
            </a>
          </li>`
        });
        return markup;
    }
}

export default new ResultView();