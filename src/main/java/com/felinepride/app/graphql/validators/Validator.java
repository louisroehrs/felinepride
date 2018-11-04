package com.felinepride.app.graphql.validators;
/**
 * IBM Confidential
 * OCO Source Materials
 * <p>
 * © Copyright IBM Corp. 2014 - 2016
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 */

/**
 * Created by lroehrs on 8/1/16.
 */


public class Validator {

    public static final String VALID_NAME_REGEXP = "[@A-Za-z0-9.,'-_ ]*";

    public static final String VALID_NAME_REGEXP_LOWERCASE_DASHES = "[@a-z0-9.-]*";
}
