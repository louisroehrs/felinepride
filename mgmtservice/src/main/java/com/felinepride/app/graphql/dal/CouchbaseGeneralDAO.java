
/**
 *
 * @author Louis F. Roehrs (lroehrs@felinepride.com)
 **/


package com.felinepride.app.graphql.dal;

import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.PersistTo;
import com.couchbase.client.java.document.JsonDocument;
import com.couchbase.client.java.document.json.JsonObject;
import com.couchbase.client.java.query.N1qlQuery;
import com.couchbase.client.java.query.N1qlQueryResult;
import com.couchbase.client.java.query.N1qlQueryRow;


public class CouchbaseGeneralDAO extends BaseDAO {


    public CouchbaseGeneralDAO(Bucket bucket) {
        this.bucket = bucket;
    }

    /* Goal is to return results just like the query UI for couchbase does */
    public String query(String query) {

        String newQuery = query.replace("{0}",bucket.name()).replace("{1}",bucket.name());

        N1qlQuery n1qlQueryquery = N1qlQuery.simple(newQuery);
        N1qlQueryResult qr1 = bucket.query(n1qlQueryquery);

        StringBuilder jsonString = new StringBuilder("[");
        for (N1qlQueryRow row : qr1.allRows()) {
            jsonString.append(row.value()).append(",");
        }
        if (jsonString.lastIndexOf(",") >0) {
            jsonString.deleteCharAt(jsonString.lastIndexOf(","));
        }
        return jsonString.append("]").toString();
    }


    public JsonDocument store (String id, JsonObject jsonObject) {
        JsonDocument response = bucket.upsert(
                JsonDocument.create(id,
                        jsonObject), PersistTo.MASTER
        );
        return response;
    }

    public JsonDocument delete (String id) {
        JsonDocument response = bucket.remove(id, PersistTo.MASTER);
        return response;
    }

}

  
