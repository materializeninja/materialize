class Materialize {

	constructor(...args){
		console.log('Materialize');

        const options = Object.assign({
            root: null, // path to root dir of materialize.js
        }, args[0]);
		Object.assign(this, options);

		this.ninja = new Ninja();
	}

	Form(...args){
		const options = Object.assign({
			form: null,
		}, args[0]);

		this.ninja.addJS(this.root + 'materialize.form.js')
			.then((value) => {
				this.form = new MaterializeForm({
					form: options.form,
					ninja: this.ninja,
					root: this.root,
				});
				this.form.buildIndexes();
			}).catch();
	}
}
