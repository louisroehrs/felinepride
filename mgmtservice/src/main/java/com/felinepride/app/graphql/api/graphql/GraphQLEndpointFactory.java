

/**
 * Created by lroehrs on 5/22/18.
 */


package com.felinepride.app.graphql.api.graphql;

import com.felinepride.app.graphql.configuration.FPConfiguration;
import com.smoketurner.dropwizard.graphql.GraphQLFactory;
import graphql.schema.GraphQLSchema;

public class GraphQLEndpointFactory {

    public static GraphQLEndpoint build(FPConfiguration configuration) {
        GraphQLFactory factory = configuration.getGraphQLFactory();
        factory.setRuntimeWiring(GraphQLDataFetcherBuilder.buildWiring());
        GraphQLSchema schema = factory.build();

        GraphQLEndpoint servlet = new GraphQLEndpoint(schema);

        return servlet;
    }
}

