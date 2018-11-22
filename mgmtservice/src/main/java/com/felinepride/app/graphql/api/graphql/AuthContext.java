

/**
 * Created by lroehrs on 5/21/18.
 */


package com.felinepride.app.graphql.api.graphql;

import graphql.servlet.GraphQLContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

public class AuthContext extends GraphQLContext {


    public AuthContext( Optional<HttpServletRequest> request, Optional<HttpServletResponse> response) {
        super(request, response);

    }


}

