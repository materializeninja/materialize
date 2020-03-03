import MaterializeField from "./FormElements/field.js";
import MaterializeValidators from "./FormElements/validators.js";

export default class MaterializeForm {

	#nodes = { };

	constructor ( ...args ) {

        const options = Object.assign( {
            form: null, // this is just the id not the element
            currentFocus: null, // order number of element in this.elements ( NOT tab number but number position ie position 0 maybe tab number 10 so not this.elements key but this.elements position )
        }, args[ 0 ] );

        Object.assign(this, options);

        this.form = document.getElementById( options.form );

        this.hijackTabbing();
    }

	async buildIndexes ( ) {

        let matches = this.form.querySelectorAll( "[tabindex]" );

        let count = 0;
        let matchLength = matches.length;

		try {

			for ( let node of Object.values( matches ) ) {

				switch( true ) {

					case node.hasAttribute( "type" ) && node.getAttribute( "type" ) === "text":

						this.processInput( node );

					break;

					case node.tagName === "SELECT":

						this.processSelect( node );

					break;

				}

			}

		} catch ( err ) {

			console.error( err );

		}

	}

    hijackTabbing ( ) {

        /*_n.on( document, "keydown", ( event ) => {

            var keyCode = _n.keyCode( event );

            if ( keyCode === 9 ) {

                event.preventDefault( );

                switch ( event.shiftKey ) {
                    case false:

                        this.forceTab( {
                            direction: "next",
                            isTab: true,
                        } );

                    break;
                    case true:

                        this.forceTab( {
                            direction: "previous",
                            isTab: true,
                        } );

                    break;

                }

            }

        } );*/

    }

	async processInput( node ) {

		try {

			let MaterializeText = await import( "./FormElements/Text/text.js" );

			this.#nodes[ node.getAttribute( "tabindex" ) ] = new MaterializeText.default( {
				node: node,
				parent: node.closest( "div.material.text" )
			} );

		} catch ( err ) {

			console.error( err );

		}

	}

    async processSelect( node ) {

        try {

            let MaterializeSelect = await import( "./FormElements/Select/select.js" );

            this.#nodes[ node.getAttribute( "tabindex" ) ] = new MaterializeSelect.default( {
                node: node,
                parent: node.closest( "div.material.select" )
            } );

        } catch ( err ) {

            console.error( err );

        }

    }

}
