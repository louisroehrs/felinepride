
package com.felinepride.app.graphql.application;

import com.codahale.metrics.health.HealthCheck;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.felinepride.app.graphql.api.graphql.GraphQLEndpoint;
import com.felinepride.app.graphql.api.graphql.GraphQLEndpointFactory;
import com.felinepride.app.graphql.api.graphql.GraphQLServletFactory;
import com.felinepride.app.graphql.configuration.CouchbaseConfiguration;
import com.felinepride.app.graphql.configuration.FPConfiguration;
import com.felinepride.app.graphql.dal.*;
import com.felinepride.app.graphql.filter.CorsFilter;
import com.felinepride.app.graphql.health.DatabaseHealthCheck;
import graphql.servlet.SimpleGraphQLServlet;
import io.dropwizard.Application;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.servlets.assets.AssetServlet;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.nio.charset.StandardCharsets;
import java.util.*;


public class FPGraphQLApplication extends Application<FPConfiguration> {

    private static final Logger log = LoggerFactory.getLogger(FPGraphQLApplication.class);


    public static void main(String[] args) throws Exception {
        new FPGraphQLApplication().run(args);
    }

    @Override
    public void initialize(Bootstrap<FPConfiguration> bootstrap) {
        // Enable variable substitution with environment variables
        bootstrap.setConfigurationSourceProvider(
                new SubstitutingSourceProvider(bootstrap.getConfigurationSourceProvider(),
                        new EnvironmentVariableSubstitutor(false)
                )
        );

    }

    @Override
    public void run(FPConfiguration configuration, Environment environment) throws Exception {

        log.debug("1");
        environment.getApplicationContext().setContextPath("/");
        log.debug("2");
        environment.servlets().addServlet("root", new AssetServlet("/root", "/", "index.html", StandardCharsets.UTF_8)).addMapping("/*");
        log.debug("3");

        // Need to make all configurations available to other classes
//        configuration.getInstance().updateFPConfiguration(configuration);
        log.debug("4");
        // TODO Remove Enable CORS headers

        final FilterRegistration.Dynamic cors =
                environment.servlets().addFilter("CORS", CrossOriginFilter.class);
        log.debug("5");
        // Configure CORS parameters
        cors.setInitParameter("allowedOrigins", "*");
        cors.setInitParameter("allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin");
        cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");
        log.debug("6");
        // Add URL mapping
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
        log.debug("7");

        // SET JERSEY FILTERS
        // Set ContainerResponseFilters and ContainerRequestFilters
        List<String> requestFilters = new ArrayList<String>();
        List<String> responseFilters = new ArrayList<String>();
        // Add additional Jersey Logging of Request/ESSResponse objects
       // if (configuration.getJerseyConfiguration().isLogTraffic()) {
       //     requestFilters.add("com.sun.jersey.api.container.filter.LoggingFilter");
       //     responseFilters.add("com.sun.jersey.api.container.filter.LoggingFilter");
       // }

        System.out.println(System.getProperty("java.class.path"));
        DAL dal = DALFactory.build(configuration);

        CouchbaseConfiguration couchbaseConfiguration = configuration.getCouchbaseConfiguration();
        String dbName = couchbaseConfiguration.getBucket();
        environment.healthChecks().register("database", new DatabaseHealthCheck(dal, dbName));
        environment.lifecycle().manage(new DALManaged(dal));

        CouchbaseGeneralDAO couchbaseGeneralDAO = dal.getCouchbaseGeneralDAO();
//        bind(CouchbaseGeneralDAO.class).toInstance(couchbaseGeneralDAO);
        DAORegistry.getInstance().setCouchbaseGeneralDAO(couchbaseGeneralDAO);


        log.debug("8");
        // Do you need CORS?  Beware of cross site scripting!
        // Add CORS response filter
        responseFilters.add(CorsFilter.class.getName());
        log.debug("9");
        // Apply Jersey Filters
        environment.jersey().property("com.sun.jersey.spi.container.ContainerRequestFilters", StringUtils.join(requestFilters.iterator(), ","));
        environment.jersey().property("com.sun.jersey.spi.container.ContainerResponseFilters", StringUtils.join(responseFilters.iterator(), ","));
        log.debug("10");
        // Allows APIs to accept Json with superfluous unrecognized fields
        // This is helpful when deploying changes that include minor updates to message formats
        environment.getObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        log.debug("11");
        // Will disable use of timestamps (numbers) and instead use a [ISO-8601]-compliant notation
        environment.getObjectMapper().configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        log.debug("12");
        // Register Logging Annotation
        //environment.jersey().register(ApiEndpointLogging.class);
        log.debug("13");
        // Add HealthChecks
        Map<String, HealthCheck> healthChecks = new HashMap<>();
        //healthChecks.put("EmptyHealthCheck", new EmptyHealthCheck());
        addHealthChecks(healthChecks, environment);
        log.debug("14");
        // Add Admin Resources
        //environment.jersey().register(ServerStatusResource.class);
        log.debug("15");
      //  enableCors(environment);
        log.debug("16");
        SimpleGraphQLServlet servlet = GraphQLServletFactory.build( configuration);
        log.debug("17");
        environment.servlets().addServlet("graphql", servlet).addMapping(new String[]{"/graphql", "/schema.json"});
        log.debug("18");

        /* secured to some extent as security only buys time, no such thing as completely secure
        put the fpadminkey in the auth header as usual to access.  Eventually we will figure out how to auth users.
         */
        GraphQLEndpoint graphQLEndpoint = GraphQLEndpointFactory.build(configuration);
        log.debug("10");
        environment.servlets().addServlet("authgraphql", graphQLEndpoint).addMapping(new String[]{"/authgraphql", "/authschema.json"});
        log.debug("20");

    }




    private void addHealthChecks(Map<String, HealthCheck> healthChecks, Environment environment) {
        // Register each health check, then test it so failures can be seen at startup.

        healthChecks.entrySet().stream().forEach(entry -> {
            String name = entry.getKey();
            HealthCheck healthCheck = entry.getValue();
            environment.healthChecks().register(name, healthCheck);
            HealthCheck.Result result = healthCheck.execute();
            if (!result.isHealthy()) {
                log.error(name + " is UNHEALTHY " + result.getMessage());
            }
        });

    }


    protected void enableCors(final Environment environment) {
        final FilterRegistration.Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
        cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "OPTIONS,GET,PUT,POST,DELETE,HEAD,PATCH");
        cors.setInitParameter("allowedHeaders", "Content-Type,X-Requested-With,Content-Length,Accept,Origin,X-XSRF-TOKEN,Authorization");
    }

}
