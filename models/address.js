import {
    GraphQLString,
} from 'graphql';

let addressConfig = {
    entityName: 'Address',
    name: 'Address',
    contactSpecificFieldsGraphQlObject: {
        address1: { type: GraphQLString },
        address2: { type: GraphQLString },
        city: { type: GraphQLString },
        zip: { type: GraphQLString },
        country: { type: GraphQLString },
    },
    classSpecificSchemaForMongoObject: {
        address1: String,
        address2: String,
        city: String,
        zip: String,
        country: String,
    }
};
module.exports = addressConfig;