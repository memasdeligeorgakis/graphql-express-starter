import {
    GraphQLString,
    GraphQLFloat,
} from 'graphql';

const productConfig = {
    entityName: 'Product',
    contactSpecificFieldsGraphQlObject: {
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
    },
    classSpecificSchemaForMongoObject: {
        name: String,
        price: Number,
    }
};
module.exports = productConfig;