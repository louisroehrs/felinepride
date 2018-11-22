package com.felinepride.app.graphql.model;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
public abstract class BaseModel implements Serializable {


    String id = UUID.randomUUID().toString();
    public String type;
    public Date createdDate;
    protected LoggedUser createdBy;
    public  Date lastModifiedDate;
    protected LoggedUser lastModifiedBy;

    public void updateWhoWhen(LoggedUser user) {
        Date d = new Date();
        if ( createdDate == null ) {
            createdDate = d;
            createdBy = user;
        }
        lastModifiedBy = user;
        lastModifiedDate = d;
    }
}
