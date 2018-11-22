

package com.felinepride.app.graphql.model;

import lombok.*;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

/**
 * Created by lroehrs on 5/16/16.
 */
@EqualsAndHashCode(callSuper = false)
@ToString
@Getter
@Setter
@NoArgsConstructor
@Slf4j
@Accessors(chain = true)
public class LoggedUser {

    public enum Field {
        ID ("id"),
        USER_NAME("userName"),
        FIRST_NAME("firstName"),
        LAST_NAME("lastName"),
        EMAIL("email");

        private final String fieldName;

        Field(String fieldName) {
            this.fieldName = fieldName;
        }

        @Override
        public String toString() {
            return this.fieldName;
        }
    }

    private String id;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String password;

    public LoggedUser setEmail(String email) {
        if (email != null)
        this.email = email.toLowerCase();
        return this;
    }

    public String getName() {
        return this.userName;
    }

}