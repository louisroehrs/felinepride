package com.felinepride.app.graphql.api.resources;

import com.fasterxml.jackson.databind.cfg.ConfigOverride;
import com.felinepride.app.graphql.application.FPGraphQLApplication;
import com.felinepride.app.graphql.configuration.FPConfiguration;

import io.dropwizard.testing.DropwizardTestSupport;
import io.dropwizard.testing.ResourceHelpers;
import org.glassfish.jersey.client.ClientProperties;
import org.glassfish.jersey.client.JerseyClientBuilder;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import javax.ws.rs.client.Client;

public abstract class AbstractResourceTest {

    public static Client client;
    public static JerseyClientBuilder builder;
    public static DropwizardTestSupport<FPConfiguration> SUPPORT = null;
    protected static final String FP_API_KEY = "IloveGraphQL";
    protected static final String BAD_FP_API_KEY = "this is not the graph you are looking for";

/*
    @BeforeSuite
    public static void setupTestSupport() {
        SUPPORT = new DropwizardTestSupport<FPConfiguration>(FPGraphQLApplication.class,
                ResourceHelpers.resourceFilePath("fp-graphql.yaml"),

                ConfigOverride.config("server.applicationConnectors[0].port", "0") // Optional, if not using a separate testing-specific configuration file, use a randomly selected port
        );
        SUPPORT.before();
        String foo = SUPPORT.getEnvironment().getAdminContext().getContextPath();
        builder = new JerseyClientBuilder(SUPPORT.getEnvironment());  // why? so we can test non-200 responses and their entities
        client = new JerseyClientBuilder(SUPPORT.getEnvironment()).build("test client");
        client.property(ClientProperties.CONNECT_TIMEOUT, 10000);
        client.property(ClientProperties.READ_TIMEOUT, 1000000);
    }

    @AfterSuite
    public void afterSuite() {
        SUPPORT.after();
    }

*/
}
