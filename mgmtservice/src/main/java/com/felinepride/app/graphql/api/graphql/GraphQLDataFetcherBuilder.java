
/**
 * Created by lroehrs on 5/19/18.
 */


package com.felinepride.app.graphql.api.graphql;

import com.couchbase.client.java.document.json.JsonObject;
import com.felinepride.app.graphql.Utils;
import com.felinepride.app.graphql.dal.CouchbaseGeneralDAO;
import com.felinepride.app.graphql.dal.DAORegistry;
import com.felinepride.app.graphql.util.EncodingUtil;
import com.google.common.primitives.Chars;
import com.nimbusds.jose.util.JSONObjectUtils;
import com.nimbusds.oauth2.sdk.util.JSONArrayUtils;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import graphql.schema.GraphQLTypeUtil;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.TypeRuntimeWiring;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.assertj.core.internal.Characters;

import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
public class GraphQLDataFetcherBuilder {

    private static Function<Map<String, Object>, String> joiner(String entrySeparator, String valueSeparator, String quote) {
        return m -> m.entrySet()
                .stream()
                .map(e ->  e.getKey() + valueSeparator + quote + e.getValue()+ quote)
                .collect(Collectors.joining(entrySeparator));
    }



    public static RuntimeWiring buildWiring() {

        final DataFetcher generalCouchbaseQuery = new DataFetcher() {

            private CouchbaseGeneralDAO couchbaseGeneralDAO = DAORegistry.getInstance().getCouchbaseGeneralDAO();

            @Override
            public Object get(DataFetchingEnvironment environment) {

                /* TODO: use environment.getSelectionSet to populate * to reduce data from cb to this service */

                StringBuilder query = new StringBuilder("select {0}.* FROM {1} ");
                if (!environment.getArguments().isEmpty()) {
                    query.append(" WHERE ");
                    query.append(joiner( " AND ", " = ","'").apply(environment.getArguments()));
                }

                String typeName = GraphQLTypeUtil.getUnwrappedTypeName((environment.getFieldType())).toLowerCase();

                query.append(" AND type = '" + typeName.replace("[","").replace("]","") +"'");

                log.debug(query.toString());

                String results = couchbaseGeneralDAO.query(query.toString());

                /* If a singular result is requested, then strip off the outer json array returned by couchbase */

                try {
                    if (typeName.indexOf("[") > -1) {
                        return JSONArrayUtils.parse(results);
                    } else {
                        return JSONObjectUtils.parse(results.substring(1,results.length()-1));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return null ;
            }
        };


        /* Let's say we muck a bit with the graphql format and have it inform us to the operations so
           we can parse it into database crud commands.   Reading is done with query, so this will handle
           create, update, delete, and maybe others, increment, decrement.

           So, a query comes in like register user.
            registeruser( body : { the data or object to create} action: "create" )
            deleteuser ( id: {of the user}  action:"delete" )
            updateuser ( id: { of the user to update} body:{the fields to update, or the whole object again}  action:"update")
            So the text in front is  friendly text, it's the action that tells us what to do.

            We could make the query name functional.    action_type ( body : { }) but if we later put in better smarts,
            these would hold less meaning in the future.

            Or we could just make the body name the action and the value what is needed.
            create : {obj}
            delete : id
            update : {obj with id}

            The object type will be the same as the field type, or the return type of the object for now.
            It could be specified in the query body later.
         */

        final DataFetcher generalCouchbaseUpdate = new DataFetcher() {

            private CouchbaseGeneralDAO couchbaseGeneralDAO = DAORegistry.getInstance().getCouchbaseGeneralDAO();

            @Override
            public Object get(DataFetchingEnvironment environment) {

                String uuidShort = EncodingUtil.generateShortUUID();

                if (environment.getArguments().isEmpty()) return null;

                JsonObject obj = JsonObject.from(environment.getArguments());

                String type = environment.getFieldType().getName().toLowerCase();

                if (type.isEmpty()) {
                    String results = JsonObject.fromJson("{\"error\":\"type missing\"}").toString();
                    return results;
                }

                String results = null;

                if (obj.getObject("create")!=null) {
                    JsonObject data = obj.getObject("create");
                    String id = type +":" + uuidShort;
                    data.put("id",id);
                    data.put("type",type);
                    results =  couchbaseGeneralDAO.store(id, data).content().toString();
                }

                if (obj.getObject("update")!=null) {
                    JsonObject data = obj.getObject("update");
                    String id = data.getString("id");
                    results = couchbaseGeneralDAO.store(id, data).content().toString();
                }
/*
                if (obj.getObject("delete")!=null) {
                    JsonObject data = obj.getObject("delete");
                    String id = data.getString("id");
                    results = couchbaseGeneralDAO.delete(id);
                }
*/
                try {
                    return JSONObjectUtils.parse(results);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                return null;

            }
        };


        final RuntimeWiring wiring = RuntimeWiring.newRuntimeWiring()
                .type("Query",
                        typeWiring -> typeWiring.defaultDataFetcher(generalCouchbaseQuery))
                .type( "Mutation",
                        typeWiring -> typeWiring.defaultDataFetcher(generalCouchbaseUpdate))
//                .type("Query",
//                        typeWiring -> typeWiring.dataFetcher("users", generalCouchbaseQuery))
//                .type("Mutation",
//                        typeWiring -> typeWiring.dataFetcher( "user", generalCouchbaseMutation))
                .build();

        return wiring;
    }
}
