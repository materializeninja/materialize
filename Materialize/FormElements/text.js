class MaterializeText extends MaterializeField {

    constructor(...args){
		console.log('MaterializeText');

        const options = Object.assign({
            element: null,
            parent: null,
			value: null,
        }, args[0]);

		super(options);
        Object.assign(this, options);

		this.bindEvents();
    }

	set value(value){
		this._value = value
	}
	get value(){
		return this._value
	}

	bindEvents(){
		_n.addEventListener(this.element, 'keyup', (event) => {
			this.value = event.target.value;
		});

		_n.addEventListener(this.element, 'focusout.ninja', (event) => {
			this.focusOut();
		});
	}

	focusOut(){
		if(!_n.empty(this.value)){
			this.parent.classList.add('active');
		}else{
            this.parent.classList.remove('active');
		}
	}
}
