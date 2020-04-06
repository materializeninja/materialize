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

	            let MaterialFieldObject;

				switch ( true ) {

                    case node.tagName === "SELECT":

						MaterialFieldObject = await import( "./FormElements/Select/select.js" );

                    break;

					case node.hasAttribute( "type" ) && node.getAttribute( "type" ) === "text":

						MaterialFieldObject = await import( "./FormElements/Text/text.js" );

					break;

                    case node.hasAttribute( "type" ) && node.getAttribute( "type" ) === "radio":

                        MaterialFieldObject = await import( "./FormElements/Radio/radio.js" );

					break;

				}

				if ( MaterialFieldObject !== undefined ) {

					let nodeClass = new MaterialFieldObject.default( {
						node: node,
						parent: node.closest( "material" )
					} );

					this.#nodes[ node.getAttribute( "tabindex" ) ] = nodeClass;

					_n.on( node, "focusin.trackfocus", ( event ) => {

						let tabindex = node.getAttribute( "tabindex" );

						this.currentFocus = Object.keys( this.#nodes ).indexOf( tabindex );

						nodeClass.focusIn( event );

						_n.on( node, "focusout.trackfocus", ( event ) => {

							node.blur( );

							nodeClass.focusOut( event );

							_n.off( node, "focusout.trackfocus" );

						} );

					} );

				}

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

				/**
				 * Calling focus( ) in Chrome also causes a focusin event 
				 * to dispatch resulting in a double call of listener 
				 * applied in applyFocusEventListener( );
				 */
                // event = new Event( "focusin" );
				// options.materialObj.node.dispatchEvent( event );

				options.materialObj.node.focus( );

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
		    
			/**
			 * There is no "tabbing" on mobile devices
			 * Because of that we don't have to worry
			 * About making this part mobile friendly
			 */
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

}
