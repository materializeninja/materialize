class MaterializeText extends MaterializeField {

    constructor(...args){
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
		_n.on(this.element, 'keyup', (event) => {
			this.value = event.target.value;
		});
	}

	focusIn(){
		super.focusIn();
		this.element.select();
	}

	focusOut(){
		super.focusOut();

		if(!_n.empty(this.value)){
			this.parent.classList.add('active');
		}else{
            this.parent.classList.remove('active');
		}
	}
}
