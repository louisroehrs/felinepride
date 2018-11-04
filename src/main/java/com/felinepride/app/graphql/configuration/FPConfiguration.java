
package com.felinepride.app.graphql.configuration;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smoketurner.dropwizard.graphql.GraphQLFactory;
import io.dropwizard.Configuration;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

public class FPConfiguration extends Configuration {

    public static FPConfiguration instance = null;

    protected FPConfiguration() {
    }

    public static FPConfiguration getInstance() {
        if (instance == null) {
            instance = new FPConfiguration();
        }
        return instance;
    }
/*
    @JsonProperty("jersey")
    public JerseyConfiguration jerseyConfiguration = new JerseyConfiguration();

    public JerseyConfiguration getJerseyConfiguration() {
        return jerseyConfiguration;
    }

    public void setJerseyConfiguration(JerseyConfiguration jersey) {
        this.jerseyConfiguration = jersey;
    }

    public void updateFPConfiguration(FPConfiguration FPConfiguration) {
        this.jerseyConfiguration = FPConfiguration.getJerseyConfiguration();
    }
*/
    public final GraphQLFactory graphql = new GraphQLFactory();

    @JsonProperty("params")
    @Getter
    @Setter
    public Map<String, String> params = new HashMap<String, String>();


    @Valid
    @Getter
    @Setter
    @JsonProperty("application")
    public ApplicationConfiguration application = new ApplicationConfiguration();

    public GraphQLFactory getGraphQLFactory() {
        return graphql;
    }

}
