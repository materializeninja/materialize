class MaterializeForm {

	constructor(...args){
		console.log('MaterializeForm');

        const options = Object.assign({
            form: null, // this is just the id not the element
			ninja: null, // ninja helper library should come from materialize.js
            root: null, // path to root dir of materialize.js
			elements: { },
        }, args[0]);
		Object.assign(this, options);

		this.form = document.getElementById(options.form);
	}

	buildIndexes(...args){
		const options = args;
		const matches = this.form.querySelectorAll('[tabindex]');

        this.ninja.addJS(this.root + 'FormElements/field.js')
			.then((value) => {
				matches.forEach((ele) => {
					switch(true){
						case ele.hasAttribute('type') && ele.getAttribute('type') == 'text':
						
							this.ninja.addJS(this.root + 'FormElements/text.js')
								.then((value) => {
									this.elements[ele.getAttribute('tabindex')] = new MaterializeText({
										element: ele,
										parent: ele.closest('div.material.text'),
                                        ninja: this.ninja
									});
								}
							);
						break;
						case ele.tagName == 'SELECT':
                            this.ninja.addJS(this.root + 'FormElements/select.js')
								.then((value) => {
                                    this.elements[ele.getAttribute('tabindex')] = new MaterializeSelect({
                                        element: ele,
                                        parent: ele.closest('div.material.select'),
										ninja: this.ninja
                                    });
								}
							);
						break;
					}
				});
			}
		);
	}
}
