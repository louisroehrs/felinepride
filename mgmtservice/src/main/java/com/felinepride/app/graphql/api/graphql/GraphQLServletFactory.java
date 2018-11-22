
/**
 * Created by lroehrs on 5/22/18.
 */


package com.felinepride.app.graphql.api.graphql;

import com.felinepride.app.graphql.configuration.FPConfiguration;
import com.smoketurner.dropwizard.graphql.GraphQLFactory;
import graphql.schema.GraphQLSchema;
import graphql.servlet.SimpleGraphQLServlet;

public class GraphQLServletFactory {

    public static SimpleGraphQLServlet build(FPConfiguration configuration) {
        GraphQLFactory factory = configuration.getGraphQLFactory();
        factory.setRuntimeWiring(GraphQLDataFetcherBuilder.buildWiring());
        GraphQLSchema schema = factory.build();

        SimpleGraphQLServlet.Builder builder = SimpleGraphQLServlet.builder(schema);
        SimpleGraphQLServlet servlet = builder
                .withInstrumentation(factory.getInstrumentations()).build();

        return servlet;
    }
}

