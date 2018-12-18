class MaterializeField {

	constructor(...args){
        const options = Object.assign({
			element: null,
			parent: null,
        }, args[0]);
		Object.assign(this, options);

		this.applyFocusEventListener();
    }

	applyFocusEventListener(){
		_n.on(this.element, 'focusin', (event) => {
			this.focusIn(event);

			_n.on(this.element, 'focusout', (event) => {
				this.focusOut(event);

				_n.off(this.element, 'focusout');
			});
		});
	}

	focusIn(event) {
	  	this.parent.classList.add('focus');
        this.element.classList.add('focus');
	}

	focusOut(event) {
	    this.parent.classList.remove('focus');
        this.element.classList.remove('focus');
	}
}
