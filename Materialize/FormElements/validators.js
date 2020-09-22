export default class MaterializeValidators {

	async init ( fieldObj ) {

		let Validator;

        switch ( fieldObj.validatorName ) {

            case "integer":

				Validator = await import( "./Validators/integer.js" );

            break;

            case "decimal":

                Validator = await import( "./Validators/decimal.js" );

            break;

           	default:

                /**
                 * Use this section to check hybrids like Currency
                 */
               	if ( fieldObj.validatorName.includes( "currency" ) ) {
                
                    this.errorMessage = "Invalid Currency Format";
                    this.country = fieldObj.validatorName.split( "-" )[ 1 ];

					/**
					 * May break this out by country eventually
					 */
                    switch( this.country ) {
                    
                        case "US":

							Validator = await import( "./Validators/currency.js" );

                        break;

                    }

                }

            break;

        }

		if ( Validator !== undefined ) {

			let test = new Validator.default( fieldObj );

			return test;

		} else {
		
			console.error( `No validator for ${ fieldObj.validatorName }` );

		}

    }

}
