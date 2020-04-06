export default class Ninja {

	#functionMap = [ ];

	#arrowKeys = [ 37, 38, 39, 40 ] // LEFT, UP, RIGHT, DOWN

	empty ( mixedVar ) {

        let i,
			len,
			key,
			undef,
			emptyValues = [ undef, null, false, "" ];

        for ( i = 0, len = emptyValues.length; i < len; i++ ) {

            if ( mixedVar === emptyValues[ i ] ) {

                return true;

            }

        }

        if ( typeof mixedVar === "object" ) {

            for ( key in mixedVar ) {

                if ( mixedVar.hasOwnProperty( key ) ) {

                    return false;

                }

            }

            return true;

        }

        return false;

    }

	getCursorPosition ( node ) {
	
		let pos = 0,
			posEnd = 0;

		if ( "selectionStart" in node ) {

			pos = node.selectionStart;
			posEnd = node.selectionEnd;

		} else if( "selection" in document ) {

			node.focus();

			var Snode = document.selection.createRange( );
			var SnodeLength = document.selection.createRange( ).text.length;

			Snode.moveStart( "character", - node.value.length );

			pos = Snode.text.length - SnodeLength;
			posEnd = Snode.text.length;

		}

		return [ pos, posEnd ];

	}

    getKeyByValue ( object, value ) {

        return Object.keys( object ).find( key => object[ key ] === value );

    }

    guid ( ) {

        let s4 = function ( ) {

            return Math
				.floor( ( 1 + Math.random( ) ) * 0x10000 )
                .toString( 16 )
                .substring( 1 );

        }

        return `${s4( )}${s4( )}-${s4( )}-${s4( )}-${s4( )}-${s4( )}${s4( )}${s4( )}`;

    }

	isArrowKey ( key ) {

		return [ "ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft" ].includes( key );

        //return this.#arrowKeys.includes( keyCode ) ? true : false;

    }

	/**
	 * @param string key single value
	 * @return boolean
	 * https://regex101.com/r/M01aDp/2/tests
	 */
	isLetterKey ( key ) {

        const regex = /^[A-Za-z]{1}$/;

        return regex.test( key );

	}

	/**
	 * @param string value
	 * @return boolean
	 * https://regex101.com/r/irBKnq/5/tests
	 */
    isNumber ( value ) {

		const regex = /^\d+$/;
		
		return regex.test( value );

    }

	/**
     * @param string key single value
     * @return boolean
	 * https://regex101.com/r/isfG4s/3/tests
	 */
	isSpecialCharKey ( key ) {

        const regex = /^[^A-Za-z0-9]{1}$/;

        return regex.test( key );

    }

    /**
     * Because we hijacked tabbing materialize ninja adds
     * A custom param to the events object called isTab
     * Because of that calue can either be the keyCode value
     * Or the event value passed from an event
     *
     * @param ( int | obj ) value = keyCode || event
     */
    isTab ( value ) {

        let bool = null;

        if( this.isNumber( value ) ) {

            bool = value === 9 ? true : false;

        } else {

            bool = ! _n.empty( value.isTab ) ? true : false;

        }

        return bool;

    }

    keyCode ( event ) {

        let keyCode = event.which || event.keyCode || 0;

        return keyCode;

    }

    on ( node, event, func, options ){

        let nodeID = node === document ? "document" : node.getAttribute( "id" );
        let _event = event.includes( "." ) ? event.split( "." )[ 0 ] : event;

        if ( this.empty( nodeID ) ) {

            nodeID = this.guid( );
            node.setAttribute( "id" , nodeID );

        }

        if ( this.#functionMap[ nodeID ] === undefined ) {

            this.#functionMap[ nodeID ] = { };

        }

        this.#functionMap[ nodeID ][ event ] = func;
        
        node.addEventListener( _event, this.#functionMap[ nodeID ][ event ], options );

    }

    off ( node, event, options ){

        let nodeID = node === document ? "document" : node.getAttribute( "id" );
        let _event = event.includes( "." ) ? event.split( "." )[ 0 ] : event;

        node.removeEventListener( _event, this.#functionMap[ nodeID ][ event ], options );

        delete this.#functionMap[ nodeID ][ event ];

    }

	spliceString ( cursorPositionStart, cursorPositionStop, source, string ) {

		let start = cursorPositionStart;
		let stop = cursorPositionStart - cursorPositionStop;

		return `${ source.slice( 0, start ) }${ string }${ source.slice( start + Math.abs( stop ) ) }`;

	}

}
