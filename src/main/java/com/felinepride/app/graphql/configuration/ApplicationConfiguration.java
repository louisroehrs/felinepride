package com.felinepride.app.graphql.configuration;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationConfiguration {

    @JsonProperty("version")
    private String version;

    @JsonProperty("aboutUrl")
    private String aboutUrl;

    @JsonProperty("applicationTitle")
    private String applicationTitle;

    @JsonProperty("fpAdminApiKey")
    private String fpAdminApiKey;

}
