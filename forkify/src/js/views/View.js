import icons from 'url:../../img/icons.svg';

export default class View{
    _data;

    render(data){
        if(!data || ( Array.isArray(data) && data.length == 0)) return this.renderError();
        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin' , markup);
    }
    update(data){
      
      this._data = data;
      const newMarkup = this._generateMarkup();

      // converting string into real DOM objects
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));

      // compare both with  isEqualNode method

      newElements.forEach( (newEle , i) => {
        const curEle = curElements[i];  
        if(!newEle.isEqualNode(curEle) && newEle?.firstChild?.nodeValue.trim() !== ''){
          // curEle.textContent = newEle.textContent;
          if(curEle?.firstChild && newEle?.firstChild)
            curEle.firstChild.nodeValue = newEle.firstChild.nodeValue;
        }

        // update attributes
        if(!newEle.isEqualNode(curEle) && newEle && curEle){
          Array.from(newEle.attributes).forEach( att => {
            curEle.setAttribute(att.name , att.value);
          })
        }
      })
    }

    renderError(message = this._errorMessage){
      const markup = `<div class="error">
          <div>
            <svg>
              <use href="${icons.split('?')[0]}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>`;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin' , markup);
    }

    renderMessage(message = this._message){
      const markup = `<div class="message">
          <div>
            <svg>
              <use href="${icons.split('?')[0]}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>`;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin' , markup);
    }

    renderSpinner(){
      const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
      this._parentElement.innerHTML = '';
      this._parentElement.insertAdjacentHTML('afterbegin' , markup);
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }
}