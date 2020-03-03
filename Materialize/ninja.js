export default class Ninja {

	#functionMap = [ ];
	#arrowKeys = {
		"37": "LEFT",
		"38": "UP",
		"39": "RIGHT",
		"40": "DOWN",
	};

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

        return this.#arrowKeys[ keyCode ] !== undefined ? this.#arrowKeys[ keyCode ] : false;

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
