class SearchView{
    _parentElement = document.querySelector('.search');
    _input = this._parentElement.querySelector('.search__field');

    getQuery(){
        const query = this._input.value;
        this._clearInput();
        return query; 
    }

    addHandleSearch(handler){
        this._parentElement.addEventListener('submit' , function(e){ 
            e.preventDefault();
            handler(); 
        });
    }

    _clearInput(){
        this._input.value = '';
    }
}

export default new SearchView();