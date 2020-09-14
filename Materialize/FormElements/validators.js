export default class MaterializeValidators {

    constructor ( fieldObj ) {

        this.fieldObj = fieldObj;

        switch ( fieldObj.validatorName ) {

            case "integer":

                this.errorMessage = "Numbers Only";

                return this.integer.bind( this );

            break;

            case "decimal":

                this.errorMessage = "Decimals Only";

                return this.decimal.bind( this );

            break;

            default:

                /**
                 * Use this sectiont to check hybrids like Currency
                 */
                if ( fieldObj.validatorName.includes( "currency" ) ) {
                
                    this.errorMessage = "Invalid Currency Format";
                    this.country = fieldObj.validatorName.split( "-" )[ 1 ];

                    switch( this.country ) {
                    
                        case "US":

                            fieldObj.value = "$";
                            fieldObj.node.value = "$";

                            fieldObj.focusOut( );

                        break;

                    }

                    return this.currency.bind( this );

                }

            break;

        }

    }

    /**
     * @param ( int | string ) value
     */
    currency ( value ) {

        switch ( this.country ) {
        
            case "US":
            
                if ( value.length > 1 ) {
                } else {

                    this.fieldObj.setFieldValue( "$" );

                    return "$";

                }

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

                    return value;

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

			return value;

		}

    }

}
