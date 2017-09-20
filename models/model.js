 import {
        GraphQLObjectType,
        GraphQLList,
        GraphQLString,
    } from 'graphql';
    class Model {
        setupEntity (entityDetails , mongooseConnection){
                this.entityName = entityDetails.entityName;

                this.classSpecificSchemaForMongo = entityDetails.classSpecificSchemaForMongoObject;
                this.contactSpecificFieldsGraphQl = entityDetails.contactSpecificFieldsGraphQlObject;

                // 2.5 GraphQL Base definitions, default field
                this.baseFieldsGraphQl = {
                    id: {type: GraphQLString},
                };

                // 3. Merge entity specific and base types
                this.contactFieldsObject = Object.assign({}, this.baseFieldsGraphQl, this.contactSpecificFieldsGraphQl);
                this.modelType = new GraphQLObjectType({
                    name: this.entityName,
                    fields: this.contactFieldsObject,
                });

                // default field for all entities in mongo
                const baseSchemaForMongoObject = {
                    tenantId: String
                };
                this.baseSchemaForMongo = baseSchemaForMongoObject;

                // 4. GraphQL resolver
                this.resolver = {
                    type: new GraphQLList(this.modelType),
                    args: {stringifiedSearchObject: {type: GraphQLString}},
                    resolve: (_, {stringifiedSearchObject}) => {
                        return new Promise((resolve, reject) => {
                            this.classModel.find(JSON.parse(stringifiedSearchObject)).lean().exec(function (err, docs) {
                                if (err) reject(err)
                                else {
                                    resolve(docs);
                                }
                            })
                        })
                    }
                }
                const mongoose = mongooseConnection;

                const classSchemaDefinition = Object.assign(
                    {},
                    this.baseSchemaForMongo,
                    this.classSpecificSchemaForMongo
                );

                // define schema
                this.classSchema = mongoose.Schema(classSchemaDefinition);

                /* define middleware (pre save) to inject when creating or updating data
                 * I think there was something with the middleware when performing find
                 * so that the tenant id had to be injected for the actual search query.
                 */
                this.classSchema.pre('save', function(next, tenantId) {
                    if(tenantId === "") next('error')
                    this.tenantId = tenantId;
                    next();
                });

                // create model of schema
                this.classModel = mongoose.model(this.entityName, this.classSchema);
        }

        /* This is how they could roughly look like with the tenant ID. For now the one in use is without tenant ID
         * At indert not need to inject tenant ID, but at find it is, because there was something that made it
         * unpractical with the pre find middleware
         */
        async set( tenantId,  objectToSave ){
            const instance = new this.classModel(objectToSave);
            await instance.save(tenantId);
        }
        async get( tenantId = 'ThisIsHereJustForTheCaseThatInNoAnyCaseWeCallWithoutId', searchQueryWithoutTenantId ){
            const baseSearchQuery = {
                tenantId
            };
            const searchQuery = Object.assign({},baseSearchQuery, searchQueryWithoutTenantId);
            const data =  await this.classModel.find(searchQuery).exec();
            return {data: data};
        }
    };

    export { Model };
