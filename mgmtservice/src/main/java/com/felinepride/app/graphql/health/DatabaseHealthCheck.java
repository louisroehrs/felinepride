package com.felinepride.app.graphql.health;
import com.codahale.metrics.health.HealthCheck;
import com.felinepride.app.graphql.dal.DAL;


public class DatabaseHealthCheck extends HealthCheck {
    private static final String ERROR = "Cannot connect to database %s";
    private final DAL dbConnection;
    private String dbName;

    public DatabaseHealthCheck(DAL dbConnection, String dbName) {
        this.dbConnection = dbConnection;
        this.dbName = dbName;
    }

    @Override
    protected Result check() throws Exception {
        if (dbConnection != null && dbConnection.isHealthy()) {
            return Result.healthy();
        } else {
            return Result.unhealthy(String.format(ERROR, dbName));
        }
    }
}