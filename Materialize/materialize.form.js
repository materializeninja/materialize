import MaterializeField from "./FormElements/field.js";
import MaterializeValidators from "./FormElements/validators.js";

export default class MaterializeForm {

	#nodes = [ ]; // array of nodes belonging to the form

	constructor ( ...args ) {

        const options = Object.assign( {
            form: null, // this is just the id not the element
            currentFocus: null, // order number of element in this.#nodes ( NOT tab number but number position ie position 0 maybe tab number 10 so not this.#nodes key but this.#nodes position )
        }, args[ 0 ] );

        Object.assign(this, options);

        this.form = document.getElementById( options.form );

        this.hijackTabbing( );
    }

	async buildIndexes ( ) {

        let matches = this.form.querySelectorAll( "[tabindex]" );

		try {

			for await ( let node of Object.values( matches ) ) {

				switch( true ) {

					case node.hasAttribute( "type" ) && node.getAttribute( "type" ) === "text":

						await this.processInput( node );

					break;

					case node.tagName === "SELECT":

						await this.processSelect( node );

					break;

				}

	            _n.on( node, "focusin.trackfocus", ( event ) => {

                    let tabindex = node.getAttribute( "tabindex" );

                    this.currentFocus = Object.keys( this.#nodes ).indexOf( tabindex );

                } );

			}

			this.currentFocus = 0;

			this.forceTab( {
				materialObj: this.#nodes[ Object.keys( this.#nodes )[ this.currentFocus ] ],
				direction: "absolute"
			} );

		} catch ( err ) {

			console.error( err );

		}

	}

    forceTab ( ...args ) {

        const options = Object.assign({
			materialObj: null,
            direction: false, // options are closest/next/previous/absolute (absolute required field to be filled out this will force the tab to this field specifically)
            isTab: false,
        }, args[0]);

        let event = null;
        let eleLength = null;
        let currentFocusedObj = null;

        switch ( options.direction ) {

            case "absolute":

                event = new Event( "focusin" );
				options.materialObj.node.dispatchEvent( event );

            break;

            case "next":

                eleLength = Object.keys( this.#nodes ).length;
                currentFocusedObj = this.#nodes[ Object.keys( this.#nodes )[ this.currentFocus ] ];

                event = new Event( "focusout" );
                event.isTab = options.isTab;

                this.currentFocus = this.currentFocus + 1;

                if ( this.currentFocus >= eleLength ) {

                    this.currentFocus = 0;

                }

                currentFocusedObj.node.dispatchEvent( event );

                this.forceTab( {
					materialObj: this.#nodes[ Object.keys( this.#nodes )[ this.currentFocus ] ],
                    direction: "absolute"
                } );

            break;

            case "previous":

                eleLength = Object.keys( this.#nodes ).length;
                currentFocusedObj = this.#nodes[ Object.keys( this.#nodes )[ this.currentFocus ] ];

                event = new Event( "focusout" );
                event.isTab = options.isTab;

                this.currentFocus = this.currentFocus - 1;

                if ( this.currentFocus < 0 ) {

                    this.currentFocus = ( eleLength - 1 );

                }

                currentFocusedObj.node.dispatchEvent( event );

                this.forceTab( {
					materialObj: this.#nodes[ Object.keys( this.#nodes )[ this.currentFocus ] ],
                    direction: 'absolute'
                } );

            break;

        }

	}

    hijackTabbing ( ) {

		_n.on( document, "keydown", ( event ) => {

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

        } );

    }

	processInput ( node ) {

		return new Promise( async ( resolve, reject ) => {

			try {

				let MaterializeText = await import( "./FormElements/Text/text.js" );

				this.#nodes[ node.getAttribute( "tabindex" ) ] = new MaterializeText.default( {
					node: node,
					parent: node.closest( "material" ) //div.material.text" )
				} );

				resolve( );

			} catch ( err ) {

				console.error( err );

				reject( );

			}

		} );

	}

    processSelect ( node ) {

		return new Promise( async ( resolve, reject ) => {

			try {

				let MaterializeSelect = await import( "./FormElements/Select/select.js" );

				this.#nodes[ node.getAttribute( "tabindex" ) ] = new MaterializeSelect.default( {
					node: node,
					parent: node.closest( "material" ) //div.material.select" )
				} );

				resolve( );

			} catch ( err ) {

				console.error( err );

				reject( );

			}

		} );

    }

}
