class MaterializeText extends MaterializeField {

    constructor(...args){
		console.log('MaterializeText');

        const options = Object.assign({
            element: null,
            parent: null,
			ninja: null,
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
		this.ninja.addEventListener(this.element, 'keyup', (event) => {
			this.value = event.target.value;
		});

		this.ninja.addEventListener(this.element, 'focusout.ninja', (event) => {
			this.focusOut();
		});
	}

	focusOut(){
		if(!this.ninja.empty(this.value)){
			this.parent.classList.add('active');
		}else{
            this.parent.classList.remove('active');
		}
	}
}
