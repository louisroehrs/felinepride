
/**
 * Created by lroehrs on 5/19/18.
 */


package com.felinepride.app.graphql.api.graphql;

import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import graphql.schema.idl.RuntimeWiring;
import lombok.extern.slf4j.Slf4j;


import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
public class GraphQLDataFetcherBuilder {

    private static Function<Map<String, Object>, String> joiner(String entrySeparator, String valueSeparator) {
        return m -> m.entrySet().stream()
                .map(e ->  e.getKey() + valueSeparator + "''" + e.getValue()+"''")  // messageformat deletes single quotes, what the hell.
                .collect(Collectors.joining(entrySeparator));
    }

    public static RuntimeWiring buildWiring() {


        final DataFetcher userDataFetcher = new DataFetcher() {

            //private UserDAO userDAO = DAORegistry.getInstance().getUserDAO();

            @Override
            public Object get(DataFetchingEnvironment environment) {
/*                User user= null;
                if (environment.containsArgument("userName")) {
                    user = userDAO.getBy(User.Field.USER_NAME, environment.getArgument("userName"));
                } else
                if (environment.containsArgument("email")) {
                    user = userDAO.getBy(User.Field.EMAIL, environment.getArgument("email"));
                }
                              return user;
*/
                try {
                    return JSONObjectUtils.parse("{\"firstName\":\"Louis\",\"lastName\":\"Roehrs\"}");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            return null;
            }
        };

        final DataFetcher orgDataFetcher = new DataFetcher() {
            //private OrganizationDAO organizationDao = DAORegistry.getInstance().getOrganizationDAO();

            @Override
            public Object get(DataFetchingEnvironment environment) {
/*
               Organization organization = null;
                if (environment.containsArgument("name")) {
                    List organizations = organizationDao.getBy(Organization.Field.ORGANIZATION_NAME, environment.getArgument("name"));
                    if (!organizations.isEmpty())
                        organization = (Organization) organizations.get(0);
                } else
                if (environment.containsArgument("id")) {
                    List organizations = organizationDao.getBy(Organization.Field.ORGANIZATION_ID, environment.getArgument("id"));
                    if (!organizations.isEmpty())
                        organization = (Organization) organizations.get(0);
                }
                return organization;
                */
                return new StringBuilder().append("{'organization':{'name':'IBM'}}");
            }

        };

        final DataFetcher usersThatCanAccessThisOrganizationDataFetcher = new DataFetcher() {

            @Override
            public Object get(DataFetchingEnvironment environment) {
/*
                log.debug("DataFetcher: usersThatCanAccessThisOrganizationDataFetcher " + environment.getArgument("name"));
                Organization organization = organizationDao.getBy(Organization.Field.ORGANIZATION_NAME,environment.getArgument("name")).get(0);
                ArrayList<User> users = (ArrayList<User>) userDAO.getByArray("organizationRoles.organizationId",organization.getId());

                OrganizationUsers organizationUsers = new OrganizationUsers();
                organizationUsers.setOrganization(organization);
                organizationUsers.setUsers(users);
                return organizationUsers;
            */
                return new StringBuilder().append("{'organization':{'name':'IBM',users:[]}}");
            }


        };



        final RuntimeWiring wiring = RuntimeWiring.newRuntimeWiring()
                .type("QueryType",
                        typeWiring -> typeWiring.dataFetcher("user", userDataFetcher))
                .type("QueryType",
                        typeWiring -> typeWiring.dataFetcher("organizationByName", orgDataFetcher))
                .type("QueryType",
                        typeWiring -> typeWiring.dataFetcher("organizationById", orgDataFetcher))
                .type("QueryType",
                        typeWiring -> typeWiring.dataFetcher("orgusers", usersThatCanAccessThisOrganizationDataFetcher))
                .build();

        return wiring;
    }
}
