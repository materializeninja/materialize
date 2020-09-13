export default class MaterializeValidators {

    getValidator ( validator ) {

        switch ( validator ) {

            case "integer":

                this.errorMessage = "Numbers Only";

                return this.integer.bind( this );

            break;

            case "decimal":

                this.errorMessage = "Decimals Only";

                return this.decimal.bind( this );

            break;

        }

    }

    /**
     * @param ( int | string ) value
     */
    decimal ( value ) {

        if ( value.length > 0 ) {

            /**
             * Check for decimal
             */
            let parts = value.toString( ).split( "." );

            switch ( parts.length ) {
            
                case 1:

                    try {

                        this.integer( parts[ 0 ] );

                    } catch ( err ) {
                    
                        throw new Error( "Decimals or Numbers Only" );

                    }

                break;

                case 2:

                    /**
                     * If there are 2 parts this is a valid decimal
                     * Validate Left & Right sides
                     */

                    try {

                        this.integer( parts[ 0 ] );

                    } catch ( err ) {

                        throw new Error( "Left side of decimal must be an integer" );

                    }

                    try {

                        this.integer( parts[ 1 ] );

                    } catch ( err ) {

                        throw new Error ( "Right side of decimal must be an integer" );

                    }

                break;

                default:

                    /**
                     * If more than 1 decimal invalid format
                     */

                    throw new Error( "Decimals can only contain 1 decimal" );

                break;

            }

        } else {
        
            return true;

        }

    }

	/**
     * @param ( int | string ) value
     */
    integer ( value ) {

		if (
			value.length > 0 &&
			! _n.isNumber( value ) 
		) {

			throw new Error( "Numbers Only" );

		} else {

			return true;

		}

    }

}
