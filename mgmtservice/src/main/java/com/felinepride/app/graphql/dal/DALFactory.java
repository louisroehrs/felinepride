
package com.felinepride.app.graphql.dal;

import com.felinepride.app.graphql.configuration.FPConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DALFactory {
    final static Logger logger = LoggerFactory.getLogger(DALFactory.class);

    private static final String ERROR = "Failed to build data access object for %s";

    public static DAL build(FPConfiguration configuration) {
        try {
            DAL dal = getDriverClass(configuration.getCouchbaseConfiguration().getDriver()).newInstance();
            dal.setConfiguration(configuration);
            dal.init(configuration.getCouchbaseConfiguration());
            return dal;
        } catch (Exception e) {
            String err = String.format(ERROR, configuration.getCouchbaseConfiguration().getDriver());
            logger.error(err, e);
            return null;
        }
    }


    @SuppressWarnings("unchecked")
    private static Class<? extends DAL> getDriverClass(String className) throws Exception {
        Class<?> clazz = Class.forName(className, true, DALFactory.class.getClassLoader());
        return (Class<? extends DAL>) clazz;
    }

}
