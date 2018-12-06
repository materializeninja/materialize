class Materialize {

	constructor(...args){
		console.log('Materialize');

		const materilizeScriptTag = document.querySelectorAll('script[src$="materialize.js"]')[0];
		const materilizeScriptTagSrc = materilizeScriptTag.getAttribute('src');
		const materilizeScriptRoot = materilizeScriptTagSrc.replace('materialize.js', '');

        const options = Object.assign({
            root: materilizeScriptRoot, // path to root dir of materialize.js
        }, args[0]);
		Object.assign(this, options);
	}

	Form(...args){
		const options = Object.assign({
			form: null,
		}, args[0]);

		_n.addJS(this.root + 'materialize.form.js')
			.then((value) => {
				this.form = new MaterializeForm({
					form: options.form,
					root: this.root,
				});
				this.form.buildIndexes();
			}).catch();
	}
}
