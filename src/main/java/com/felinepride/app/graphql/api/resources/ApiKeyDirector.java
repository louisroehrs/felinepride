package com.felinepride.app.graphql.api.resources;

/**
 *
 * @author Louis F. Roehrs (lroehrs@us.felinepride.com)
 **/

import com.felinepride.app.graphql.configuration.ApplicationConfiguration;
import com.google.inject.Inject;

import javax.ws.rs.ext.Provider;
import java.nio.charset.Charset;
import java.util.Base64;

@Provider
//@AllArgsConstructor
public class ApiKeyDirector {


    private static ApplicationConfiguration applicationConfiguration;
    public static String NULL_API_KEY = "null-api-key";

    public static ApplicationConfiguration getApplicationConfiguration() {
        return applicationConfiguration;
    }

    @Inject
    public void setApplicationConfiguration(ApplicationConfiguration applicationConfiguration) {
        ApiKeyDirector.applicationConfiguration = applicationConfiguration;
    }



    public static String getApiKeyFromHeader(String headerValue) {
        try {
            String[] basicApiKey = headerValue.split(" ");
            //return new String(Base64.getDecoder().decode(basicApiKey[1]), Charset.forName("UTF-8"));
            return basicApiKey[1];
        } catch (Exception e) {
            return NULL_API_KEY;
        }
    }

    public static String encodeApiKeyToBasic(String apiKey) {
        return "Basic " + encodeApiKey(apiKey);
    }
    public static String encodeApiKey(String apiKey) {
        return new String(Base64.getEncoder().encodeToString((apiKey).getBytes()));
    }
    public static Boolean isFPAdminKeyValid(String headerValue) {
        String decodedHeaderValue = null;
        if ( headerValue == null ) {
            return false;
        }
        try {
            decodedHeaderValue = new String(Base64.getDecoder().decode(getApiKeyFromHeader(headerValue)), Charset.forName("UTF-8"));
        }
        catch (IllegalArgumentException iae) {
            return false;
        }
        return (decodedHeaderValue.equals(applicationConfiguration.getFPAdminApiKey()));
    }
}
