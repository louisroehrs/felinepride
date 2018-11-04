package com.felinepride.app.graphql.api.resources;

import com.google.gson.JsonParser;
import net.minidev.json.JSONObject;
import org.testng.Assert;
import org.testng.annotations.Test;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URLEncoder;

public class ApiKeyTest extends AbstractResourceTest {

    @Test
    public void IBMApiKey() {
        /*
        Response response = client.target(
                String.format("http://localhost:%d" + orgPath, SUPPORT.getLocalPort()))
                .request()
                .header(HeaderParamNames.AUTHORIZATION, ApiKeyDirector.encodeApiKeyToBasic(IBM_API_KEY))
                .get(Response.class);
        Assert.assertEquals(response.getStatus(),200);
        Assert.assertTrue(response.getOrganizations().size()>0);
        */
    }

 //   @Test(expectedExceptions = ForbiddenException.class)
    public void badIBMApiKey() {
/*
        Response response = client.target(
                String.format("http://localhost:%d" + orgPath, SUPPORT.getLocalPort()))
                .request()
                .header(HeaderParamNames.AUTHORIZATION, ApiKeyDirector.encodeApiKeyToBasic("1-2-3-4"))
                .get(Response.class);
                */
    }

    @Test
    public void graphqlSmokeTest () {
        try {
            Response response = client.target(
                    String.format("http://localhost:%d/graphql",SUPPORT.getLocalPort()))
                    .queryParam("query", URLEncoder.encode("{user(userName:\"lroehrs@us.felinepride.com\"){firstName}}","UTF-8"))
                            .request().accept(MediaType.APPLICATION_JSON_TYPE)
                            .get(Response.class);
            Assert.assertEquals(response.getStatus(),200);
            String jsonString = response.readEntity(String.class);


            Assert.assertEquals(new JsonParser()
                            .parse(jsonString)
                            .getAsJsonObject()
                            .getAsJsonObject("data")
                            .getAsJsonObject("user")
                            .getAsJsonPrimitive("firstName")
                            .getAsString()
                    ,"Louis");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
