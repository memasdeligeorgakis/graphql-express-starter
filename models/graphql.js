import graphqlHTTP from 'express-graphql';
import {
    GraphQLSchema,
    GraphQLObjectType,
} from 'graphql';
import mongoose from 'mongoose';
import { Model } from './model';
import addressConfig from './address';
import contactConfig from './contact';
import productConfig from './product';

const contact = new Model();
const address = new Model();
const product = new Model();
const init = async () => {
    try {
        const mongoDB = 'mongodb://localhost/memas1';
        await Promise.all([
            address.setupEntity(addressConfig, mongoose),
            contact.setupEntity(contactConfig, mongoose),
            product.setupEntity(productConfig, mongoose),
        ]);
        await mongoose.connect(mongoDB);
    } catch (error) {
        console.log(error);
    }
}

init();
var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        contacts: contact.resolver,
        addresses: address.resolver,
        products: product.resolver,
    },
});
var rootSchema = new GraphQLSchema({
    query: queryType
});

module.exports = graphqlHTTP({
    schema: rootSchema,
    graphiql: true,
    pretty: true
});