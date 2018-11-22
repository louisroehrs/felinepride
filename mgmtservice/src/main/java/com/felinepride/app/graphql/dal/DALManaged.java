

package com.felinepride.app.graphql.dal;

import io.dropwizard.lifecycle.Managed;

public class DALManaged implements Managed {
    private DAL dal;

    public DALManaged(DAL dal) {
        this.dal = dal;
    }

    public void start() throws Exception {
        dal.start();
    }

    public void stop() throws Exception {
        dal.stop();
    }

}
