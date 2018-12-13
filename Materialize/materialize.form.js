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

	async buildIndexes(...args){
		const options = args;
		const matches = this.form.querySelectorAll('[tabindex]');

		try {
			await _n.addJS(this.root + 'FormElements/field.js');

			matches.forEach(async (ele) => {

				switch(true){
					case ele.hasAttribute('type') && ele.getAttribute('type') == 'text':
						await this.processInput(ele);
					break;
					case ele.tagName == 'SELECT':
						await this.processSelect(ele);
					break;
				}

			});
		} catch(err) {
		}
	}

	async processInput(ele){
		return new Promise(async (resolve, reject) => {
			try {
				await _n.addJS(this.root + 'FormElements/text.js');
				
				this.elements[ele.getAttribute('tabindex')] = new MaterializeText({
					element: ele,
					parent: ele.closest('div.material.text'),
				});

				resolve(ele);
			} catch (err) {
				reject(err);
			}
		});
	}

	processSelect(ele){
        return new Promise(async (resolve, reject) => {
            try {
				await _n.addJS(this.root + 'FormElements/select.js')

				this.elements[ele.getAttribute('tabindex')] = new MaterializeSelect({
					element: ele,
					parent: ele.closest('div.material.select'),
				});

                resolve(ele);
            } catch (err) {
                reject(err);
            }
		});
	}
}
