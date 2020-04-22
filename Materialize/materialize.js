export default class Materialize {

	#form;

	constructor ( ) {

	}

	async Form ( ...args ) {

        const options = Object.assign( {
            form: null
        }, args[ 0 ] );

        try {

			let MaterializeForm = await import( "./materialize.form.js" );

            this.#form = new MaterializeForm.default( {
                form: options.form
            } );

            this.#form.buildIndexes( );

        } catch( err ) {

			console.error( err );

        }

        return this;
    }
}
