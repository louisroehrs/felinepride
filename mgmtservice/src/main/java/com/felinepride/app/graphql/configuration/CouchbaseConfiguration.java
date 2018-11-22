
/**
 *
 * @author Louis F. Roehrs (lroehrs@felinepride.com)
 **/

package com.felinepride.app.graphql.configuration;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouchbaseConfiguration {
    private List<String> nodes;
    private String bucket;
    private String bucketPassword;
    private String driver;

}
