class MaterializeForm {

	constructor(...args){
		console.log('MaterializeForm');

        const options = Object.assign({
            form: null, // this is just the id not the element
            root: null, // path to root dir of materialize.js
			elements: { },
        }, args[0]);
		Object.assign(this, options);

		this.form = document.getElementById(options.form);
	}

	buildIndexes(...args){
		const options = args;
		const matches = this.form.querySelectorAll('[tabindex]');

        _n.addJS(this.root + 'FormElements/field.js')
			.then((value) => {
				matches.forEach((ele) => {
					switch(true){
						case ele.hasAttribute('type') && ele.getAttribute('type') == 'text':
						
							_n.addJS(this.root + 'FormElements/text.js')
								.then((value) => {
									this.elements[ele.getAttribute('tabindex')] = new MaterializeText({
										element: ele,
										parent: ele.closest('div.material.text'),
									});
								}
							);
						break;
						case ele.tagName == 'SELECT':
                            _n.addJS(this.root + 'FormElements/select.js')
								.then((value) => {
                                    this.elements[ele.getAttribute('tabindex')] = new MaterializeSelect({
                                        element: ele,
                                        parent: ele.closest('div.material.select'),
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
