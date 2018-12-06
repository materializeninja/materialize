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
		_n.addEventListener(this.element, 'focusin', (event) => {
//            event.stopImmediatePropagation();
//            event.preventDefault();

			this.parent.classList.add('focus');
			this.element.classList.add('focus');

			_n.addEventListener(this.element, 'focusout', (event) => {
    	        this.parent.classList.remove('focus');
	            this.element.classList.remove('focus');

				var customEvent = new Event('focusout.ninja');
				this.element.dispatchEvent(customEvent);

				_n.removeEventListener(this.element, 'focusout');
			});
		});
	}
}
