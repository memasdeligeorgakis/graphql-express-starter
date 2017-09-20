import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

import addressConfig from './address';

const contactConfig = {
    entityName: 'Contact',
        contactSpecificFieldsGraphQlObject: {
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    company_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    note: { type: GraphQLString },
    website: { type: GraphQLString },
    addresses: { type: new GraphQLList(new GraphQLObjectType({
        name: 'Contact_Address',
        fields: addressConfig.contactSpecificFieldsGraphQlObject
    }))},
},
    classSpecificSchemaForMongoObject: {
        first_name: String,
            last_name: String,
            company_name: String,
            email: String,
            phone: String,
            note: String,
            website: String,
            adresses: {
            address1: String,
                address2: String,
                city: String,
                zip: String,
                country: String,
        }
    }
};
module.exports = contactConfig;