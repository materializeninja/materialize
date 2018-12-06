class MaterializeField {

	constructor(...args){
		console.log('MaterializeField');

        const options = Object.assign({
			element: null,
			parent: null,
			ninja: null,
        }, args[0]);
		Object.assign(this, options);

		this.applyFocusEventListener();
    }

	applyFocusEventListener(){
        this.ninja.addEventListener(this.element, 'focusin', (event) => {
//            event.stopImmediatePropagation();
//            event.preventDefault();

			this.parent.classList.add('focus');
			this.element.classList.add('focus');

			this.ninja.addEventListener(this.element, 'focusout', (event) => {
    	        this.parent.classList.remove('focus');
	            this.element.classList.remove('focus');

				var customEvent = new Event('focusout.ninja');
				this.element.dispatchEvent(customEvent);

				this.ninja.removeEventListener(this.element, 'focusout');
			});
		});
	}
}
