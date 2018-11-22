package com.felinepride.app.graphql.dal;

import com.couchbase.client.core.config.ConfigurationException;
import com.couchbase.client.core.retry.FailFastRetryStrategy;
import com.couchbase.client.core.time.Delay;
import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.CouchbaseCluster;
import com.couchbase.client.java.env.CouchbaseEnvironment;
import com.couchbase.client.java.env.DefaultCouchbaseEnvironment;
import com.couchbase.client.java.error.InvalidPasswordException;
import com.felinepride.app.graphql.configuration.CouchbaseConfiguration;
import com.felinepride.app.graphql.configuration.FPConfiguration;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import java.util.Calendar;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
public class DAL {
    final static String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
    final static Logger LOG = LoggerFactory.getLogger(DAL.class);

    Cluster cluster;
    Bucket bucket;

    @Getter
    @Setter
    private FPConfiguration configuration;
    static Gson gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();
    //EEE MMM dd hh:mm:ss zzz yyyy

    public void init(CouchbaseConfiguration configuration) {
//        this.configuration = configuration;
        try {
            if (configuration.getNodes() != null && configuration.getBucket() != null) {
                CouchbaseEnvironment env = DefaultCouchbaseEnvironment
                        .builder()
                        .autoreleaseAfter(10000)
                        .retryStrategy(FailFastRetryStrategy.INSTANCE)
                        .reconnectDelay(Delay.fixed(2, TimeUnit.SECONDS))
                        .connectTimeout(50000)
                        .kvEndpoints(4)
                        .kvTimeout(10000)
                        .build();
                LOG.debug("Attempting to connect to Couchbase nodes at {}", configuration.getNodes().stream().map(x -> x).collect(Collectors.joining(" | ")));
                cluster = CouchbaseCluster.create(env, configuration.getNodes());
                cluster.authenticate(configuration.getBucket(),configuration.getBucketPassword());

                try {
                    bucket = cluster.openBucket(configuration.getBucket());
                } catch (ConfigurationException | InvalidPasswordException e) {
                    log.error("Couchbase could not open bucket \"{}\" error on startup: {}", configuration.getBucket(), e.getMessage());
                    log.error("Exception: {}", e);
                    cluster.disconnect();
                    System.exit(0);
                }
            } else {
                LOG.error("Insufficient configuration " + configuration.toString());
            }
        } catch (Exception e) {
            LOG.error("Failed to create couchbase client data access layer due to error " + e.getMessage(), e);
        }
    }

    public boolean isHealthy() {

        for (String node : configuration.getCouchbaseConfiguration().getNodes()) {
            String target = "http://" + node + ":8091/pools/default";
            WebTarget client = ClientBuilder.newClient()
                    .target(target);
            Invocation.Builder builder = client.request(MediaType.APPLICATION_JSON);
            long startTimeInMillis = Calendar.getInstance().getTimeInMillis();

            log.debug("Request Counchbase health " + startTimeInMillis);
            javax.ws.rs.core.Response couchbaseHealth = builder.get();
            log.debug("Received Couchbase healthresponse " + (Calendar.getInstance().getTimeInMillis() - startTimeInMillis));
            if (couchbaseHealth.getStatus() != 200) {
                return false;
            }
            String payload = couchbaseHealth.readEntity(String.class);
            com.google.gson.JsonObject tObj = new JsonParser().parse(payload).getAsJsonObject();
            JsonArray nodes = tObj.getAsJsonArray("nodes");
            for (int i = 0; i < nodes.size(); i++) {
                com.google.gson.JsonObject jsonNode = nodes.get(i).getAsJsonObject();

                String healthStatus = jsonNode.get("status").getAsString();
                if (!healthStatus.equals("healthy")) {
                    return false;
                }
            }
        }
        return true;
    }

    public void start() {
        // do nothing
    }

    public void stop() {
        bucket.close();
        if (cluster != null)
            cluster.disconnect();
    }

    public CouchbaseGeneralDAO getCouchbaseGeneralDAO() { return new CouchbaseGeneralDAO(bucket); }

}
