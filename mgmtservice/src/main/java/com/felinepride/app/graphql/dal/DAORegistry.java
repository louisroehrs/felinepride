
package com.felinepride.app.graphql.dal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DAORegistry {

/* This exists because graphql servlet is setup without access. */
    private static DAORegistry instance;

    private CouchbaseGeneralDAO couchbaseGeneralDAO;

    private DAORegistry() {
    }

    public static DAORegistry getInstance() {
        if(instance == null){
            instance = new DAORegistry();
        }
        return instance;
    }

}
