import Integer from "./integer.js";

export default class Decimal {

	integer;
	precision;

	constructor ( precision = 0 ) {

		this.integer = new Integer( );
		this.precision = precision;

	}

    /**
     * @param ( int | string ) value
     */
   	test ( value ) {

        if ( value.length > 0 ) {

            /**
             * Check for decimal
             */
            let parts = value.toString( ).split( "." );

            switch ( parts.length ) {
            
                case 1:

                    try {

                        this.integer.test( parts[ 0 ] );

                    } catch ( err ) {
                    
                        throw new Error( "Decimals or Numbers Only" );

                    }

                    return value;

                break;

                case 2:

                    /**
                     * If there are 2 parts this is a valid decimal
                     * Validate Left & Right sides
                     */

                    try {

                        this.integer.test( parts[ 0 ] );

                    } catch ( err ) {

                        throw new Error( "Left side of decimal must be an integer" );

                    }

                    try {

                        this.integer.test( parts[ 1 ] );

                    } catch ( err ) {

                        throw new Error ( "Right side of decimal must be an integer" );

                    }

					if ( this.precision > 0 ) {

						if ( parts[ 1 ].length > this.precision ) {

							throw new Error ( `Limit ${ this.precision } decimal places` );

						}

					}

                    return value;

                break;

                default:

                    /**
                     * If more than 1 decimal invalid format
                     */

                    throw new Error( "Decimals can only contain 1 decimal" );

                break;

            }

        } else {
        
            return value;

        }

    }

}
