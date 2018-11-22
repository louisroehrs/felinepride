package com.felinepride.app.graphql.dal;


import com.couchbase.client.deps.com.fasterxml.jackson.databind.ObjectMapper;
import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.PersistTo;
import com.couchbase.client.java.document.JsonDocument;
import com.couchbase.client.java.document.RawJsonDocument;
import com.couchbase.client.java.document.json.JsonObject;
import com.couchbase.client.java.query.*;
import com.couchbase.client.java.query.dsl.Expression;
import com.felinepride.app.graphql.model.BaseModel;
import com.felinepride.app.graphql.model.LoggedUser;
import com.google.gson.Gson;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@Slf4j
public abstract class BaseDAO {

    Bucket bucket = null;

    public synchronized <T extends BaseModel> String save(T obj,LoggedUser u) {
        obj.setLastModifiedDate(new Date());
        JsonObject jsonObject = JsonObject.create().put(obj.getType(),obj);
//        JsonObject jsonObj = JsonObject.fromJson("{\"" + obj.getType() + "\":" + this.gson.toJson(obj) + "}");
        if (u != null) {
            obj.updateWhoWhen(u);
        }
        JsonDocument response = bucket.upsert(
                JsonDocument.create(obj.getId(),
                        jsonObject), PersistTo.MASTER
        );
        return response.id();
    }

    public <T extends BaseModel> List<T> getBy(T obj, String type, String field, String fieldValue) {
        List<T> result = new ArrayList<>();
        Statement st = Select.select(type).from(bucket.name())
                .where(Expression.x(type + "." + field).eq(Expression.x("$value")));
        JsonObject phv = JsonObject.create().put("value", fieldValue);
        N1qlQuery queryInstancesDSL = N1qlQuery.parameterized(st, phv);
        N1qlQueryResult qr1 = bucket.query(queryInstancesDSL);
        ObjectMapper mapper = new ObjectMapper();
        for (N1qlQueryRow rows : qr1.allRows()) {
            String rowString = rows.value().toString();
            try {
                T rowObj = (T) mapper.readValue(mapper.readTree(rowString).get(type).toString(), obj.getClass());
                result.add(rowObj);
            } catch (IOException e) {
                log.error("Could not create object from results. {}", e);
            }
        }
        return result;
    }

    /*
    public <T extends BaseModel> T getByKey( final String couchbaseKey, T t ) {

        RawJsonDocument rjd = bucket.get(couchbaseKey, RawJsonDocument.class);
        if ( rjd == null ) {
            return null;
        }
        JsonObject jsonObject = JsonObject.fromJson(rjd.content());
        if (jsonObject == null  ) {
            return null;
        };
        return (T) gson.fromJson(jsonObject.getObject(t.type).toString(), t.getClass());
    }

*/
}
