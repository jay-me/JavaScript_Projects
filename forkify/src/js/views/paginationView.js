import View from "./View";
import icons from 'url:../../img/icons.svg';
import { isGeneratorFunction } from "regenerator-runtime";

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');
   
    addHandleClick(handler){
        this._parentElement.addEventListener('click' , function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;

            const gotoPage = +btn.dataset.goto;
        
            handler(gotoPage);
        })
    }
    _generateMarkup(){
        const pages = Math.ceil(this._data.results.length / this._data.resultPerPage); 

        // 1. only 1 page no other page
        if(this._data.page === 1 && pages === 1){
            return '';
        }
        // 2. only next
        if(this._data.page === 1 && this._data.page < pages ){
            return `<button data-goto='${this._data.page + 1}' class="btn--inline pagination__btn--next">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                <use href="${icons.split('?')[0]}#icon-arrow-right"></use>
                </svg>
            </button>`;
        }

        // 3. next and pre both 
        if(this._data.page > 1 && this._data.page < pages){
            return `<button data-goto='${this._data.page - 1}' class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons.split('?')[0]}#icon-arrow-left"></use>
                        </svg>
                        <span>Page ${this._data.page - 1}</span>
                    </button>
                    <button data-goto='${this._data.page + 1}' class="btn--inline pagination__btn--next">
                        <span>Page ${this._data.page + 1}</span>
                        <svg class="search__icon">
                        <use href="${icons.split('?')[0]}#icon-arrow-right"></use>
                        </svg>
                    </button>`;
        }

        // 4. only pre
        if(this._data.page > 1 && this._data.page == pages){
            return `<button data-goto='${this._data.page - 1}' class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons.split('?')[0]}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.page - 1}</span>
            </button>`;
        }
    }

}

export default new PaginationView();