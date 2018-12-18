class MaterializeField {

	constructor(...args){
		console.log('MaterializeField');

        const options = Object.assign({
			element: null,
			parent: null,
        }, args[0]);
		Object.assign(this, options);

		this.applyFocusEventListener();
    }

	applyFocusEventListener(){
		_n.on(this.element, 'focusin', (event) => {
//            event.stopImmediatePropagation();
//            event.preventDefault();

     		let customEvent = new Event('focusin.ninja');
          	this.element.dispatchEvent(customEvent);

			this.parent.classList.add('focus');
			this.element.classList.add('focus');

			_n.on(this.element, 'focusout', (event) => {
    	        this.parent.classList.remove('focus');
	            this.element.classList.remove('focus');

				let customEvent = new Event('focusout.ninja');
				this.element.dispatchEvent(customEvent);

				_n.off(this.element, 'focusout');
			});
		});
	}
}
