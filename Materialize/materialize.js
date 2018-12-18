class Materialize {

	constructor(...args){
		const materilizeScriptTag = document.querySelectorAll('script[src$="materialize.js"]')[0];
		const materilizeScriptTagSrc = materilizeScriptTag.getAttribute('src');
		const materilizeScriptRoot = materilizeScriptTagSrc.replace('materialize.js', '');

        const options = Object.assign({
            root: materilizeScriptRoot, // path to root dir of materialize.js
        }, args[0]);
		Object.assign(this, options);

		return this;
	}

	async Form(...args){
		const options = Object.assign({
			form: null,
		}, args[0]);

		try {
			let value = await _n.addJS(this.root + 'materialize.form.js');

			this.form = new MaterializeForm({
				form: options.form,
				root: this.root,
			});

			this.form.buildIndexes();
		} catch(err) {
		}

		return this;
	}
}
