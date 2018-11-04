

/**
 * Created by lroehrs on 5/21/18.
 */


package com.felinepride.app.graphql.api.graphql;

import graphql.schema.GraphQLSchema;
import graphql.servlet.GraphQLContext;
import graphql.servlet.SimpleGraphQLServlet;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.HttpHeaders;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
public class GraphQLEndpoint extends SimpleGraphQLServlet {

    SimpleGraphQLServlet servlet;


    public GraphQLEndpoint(GraphQLSchema schema) {
        super(schema);
    }

    @Override
    protected GraphQLContext createContext(Optional<HttpServletRequest> request, Optional<HttpServletResponse> response) {
        Subject currentUser = SecurityUtils.getSubject();

        request.get().getHeader("Authorization");

        if (!currentUser.isAuthenticated()) {
            // Check if using bearer token authorization header
            String apiKey = null;
            boolean allowed = false;

            String authorizationHeader = request.get().getHeader(HttpHeaders.AUTHORIZATION);
            if (ApiKeyDirector.isIBMAdminKeyValid(authorizationHeader)) {
                List<String> globalRoles = new ArrayList<String>();
                globalRoles.add("IBMAdmin");
                //User adminUser = new User();
                //adminUser.setUserName("IBMAdminKey")
//                        .setGlobalRoles(globalRoles);
                return new AuthContext( request,response);
            }
        }
        return null;
    }

             /* figure out how to indicate what graphiql things require types of access */
             /*
            else {


                if (commandPermissions.requireIBMAdminAccess()) {
                    requestContext.abortWith(Response.status(HttpStatus.FORBIDDEN).entity(new ErrorResponse(HttpStatus.FORBIDDEN, NEED_VALID_BASE64_API_KEY)).build());
                    return;

                }
            }

            if (authorizationHeader == null) {
                // Check to see if the request provided the apiKey as a query parameter instead of in the headers
                if (commandPermissions.allowQueryParameterCredentials()) {
                    apiKey = requestContext.getUriInfo().getQueryParameters().getFirst(API_KEY_QUERY_PARAM_NAME);
                    log.debug("API Key provided in the query parameters: " + apiKey);
                }
            } else {
                // An Authorization header was present; check to see if it's the right format
                //if (authorizationHeader.startsWith(BASIC_)) {
//                    apiKey = authorizationHeader.substring(BASIC_.length());
//                    header = requestContext.getHeaderString(HeaderParamNames.AUTHORIZATION);
//                } else {   // Check instance and/or org data key...
                apiKey = ApiKeyDirector.getApiKeyFromHeader(authorizationHeader);
//                }

                if (apiKey != null) {
                    if (commandPermissions.requireInstanceDataAccess()) {
                        Instance instance = ApiKeyDirector.getInstanceFromDataApiKey(ApiKeyDirector.getApiKeyFromHeader(authorizationHeader));
                        if (instance == null) {
                            try {
                                Base64.getDecoder().decode(apiKey);
                            }
                            catch( IllegalArgumentException iae) {
                                requestContext.abortWith(Response.status(HttpStatus.BAD_REQUEST).entity(new ErrorResponse(HttpStatus.BAD_REQUEST, NEED_VALID_BASE64_API_KEY)).build());
                                return;
                            }
                            requestContext.abortWith(Response.status(HttpStatus.NOT_FOUND).entity(new ErrorResponse(HttpStatus.NOT_FOUND, NO_INSTANCE_FOUND_FOR_API_KEY + authorizationHeader.replace(HeaderParamNames.BASIC_TOKEN, "") + REQUIRES_INSTANCE_DATA_API_KEY)).build());
                            return;
                        } else {
                            allowed = true;
                            requestContext.getHeaders().add(HeaderParamNames.INSTANCE_ID, instance.getId());
                            requestContext.getHeaders().add(HeaderParamNames.ORGANIZATION_ID, instance.getOrganizationId());
                        }
                    } else if (commandPermissions.requireOrganizationAdminAccess()) {
                        Organization organization = ApiKeyDirector.getOrganizationFromOrganizationAdminKey(apiKey);
                        if (organization != null) {
                            allowed = true;
                            requestContext.getHeaders().add(HeaderParamNames.ORGANIZATION_ID, organization.getId());
                        }
                    }
                }
                if (!allowed) {
                    try {
                        Base64.getDecoder().decode(apiKey);
                    }
                    catch( IllegalArgumentException iae) {
                        requestContext.abortWith(Response.status(HttpStatus.BAD_REQUEST).entity(new ErrorResponse(HttpStatus.BAD_REQUEST, NEED_VALID_BASE64_API_KEY)).build());
                        return;
                    }
                    requestContext.abortWith(Response.status(HttpStatus.NOT_FOUND).entity(new ErrorResponse(HttpStatus.NOT_FOUND, NEED_VALID_ORG_ADMIN_API_KEY)).build());
                    return;
                }
                return;
            } //else{
               //     throw new ForbiddenException(HttpResponse.Messages.USER_NOT_AUTHENTICATED);
               // }


        }


        if (currentUser.isAuthenticated())

        {
            // Check Permissions for requesting method
            Collection<Permission> requiredPermissions = getRequiredPermissions(requestContext);
            if (currentUser.isPermittedAll(requiredPermissions)) {
                // Success.
            } else {
                requiredPermissions.stream()
                        .filter(permission -> !currentUser.isPermitted(permission))
                        .forEach(permission -> log.debug("Didn't have required permission: " + permission));
                throw new ForbiddenException(HttpResponse.Messages.USER_NOT_AUTHORIZED);
            }
            requestContext.getHeaders().add(HeaderParamNames.ORGANIZATION_ID, getPathParam(requestContext, PathParamNames.ORGANIZATION_ID).orElse("none"));
            requestContext.getHeaders().add(HeaderParamNames.INSTANCE_ID, getPathParam(requestContext, PathParamNames.INSTANCE_ID).orElse("none"));

        } else
        {
            throw new ForbiddenException(HttpResponse.Messages.USER_NOT_AUTHENTICATED);
        }


        User user = request
                .map(req -> req.getHeader("Authorization"))
                .filter(id -> !id.isEmpty())
                .map(id -> id.replace("Bearer ", ""))
                .map(userRepository::findById)
                .orElse(null);
        return new AuthContext(user, request, response);
        */


}
