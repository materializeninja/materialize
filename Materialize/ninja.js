export default class Ninja {

	#functionMap = [ ];

	#directionKeys = [ 9, 13, 33, 34, 35, 36, 37, 38, 39, 40 ]; // 13 && 9 are enter and tab keys
	#letterKeys = [ 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90 ];
	#specialCharKeys = [ 106, 107, 109, 111, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222 ];
	#shiftSpecialCharKeys = [ 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57 ]; // shiftKey must be pressed for these keys to be special characters

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

	isArrowKey ( keyCode ) {

        return this.#arrowKeys.includes( keyCode ) ? true : false;

    }

	isLetterKey ( keyCode ) {

        return this.#letterKeys.includes( keyCode ) ? true : false;

	}

    isNumber ( value, strict = true ) {

        let bool = null;

        if ( strict ) {

            bool = ! isNaN( value ) && ( value instanceof Number || typeof( value ) == "number" ) ? true : false;

        } else {

            bool = ! isNaN( value - parseFloat( value ) );

        }

        return bool;

    }

	isShiftSpecialCharKey ( keyCode ) {

        return this.#shiftSpecialCharKeys.includes( keyCode ) ? true : false; 

    }

	isSpecialCharKey ( keyCode ) {

        return this.#specialCharKeys.includes( keyCode ) ? true : false;

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

        let nodeID = node === document ? node : node.getAttribute( "id" );
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

        let nodeID = node === document ? node : node.getAttribute( "id" );
        let _event = event.includes( "." ) ? event.split( "." )[ 0 ] : event;

        node.removeEventListener( _event, this.#functionMap[ nodeID ][ event ], options );

        delete this.#functionMap[ nodeID ][ event ];

    }

}
