import {config} from './config';
import { authHeader } from '../helpers';
const axios = require('axios');

export const graphqlService = {
  graphQuery: doGraphQuery       // schema query, parameters, fields
//  , graphMutation: doGraphMutation   // schema query, action [create|update|delete], jsonobject, schema objectType, fields to bring back
};


/* This is the graphql query creator 
 * GraphQL Query:
 * { login (userName: "fluffbucket",password:"test1234") {
 * id 
 * type
 * userName
 * }}
 *
 * query is the name of the query 'login'
 * parameters is JSONObject of the parameters {userName:"fluffbucket","password": "test1234"}
 * fields is a string of the fields in graphql notation
*/

const CL = "{", CR ="}", PL="(", PR =")";

function graphqlQueryRequest(query,parameters, fields) {
  return  {
    method: 'POST',
    url:`${config.apiUrl}/graphql`,
    header: "Content-Type: application/json",
    data: { "query" : graphqlQuery(query,
        parameters,
        fields),
      "variables":null,
      "operationName":null}
  }
}

function graphqlMutationRequest(query,action, object, objectType, fields) {
  return  {
    method: 'POST',
    url:`${config.apiUrl}/graphql`,
    header: "Content-Type: application/json",
    data: { "query" : graphqlMutation(query,
        action,
        objectType,
        fields),
      "variables":object,
      "operationName":null}
  }
}

/* builds { query: getAllUsers {id type userName} }
 * query: "getAllUsers"
 * parameters: json object
 * fields: string beginning with { and fields  subfields and ending with } */

function graphqlQuery(query,parameters, fields) {
  let parameterList = [];
  for (var p in parameters) {
    parameterList.push(p + ':"'+parameters[p]+'"');
  }
  let graphqlQuery = CL + query;
  if (parameters) {
    graphqlQuery +=  PL + parameterList.join(" ") + PR
  }
  graphqlQuery += fields + CR;
  return graphqlQuery;
}


/* builds
mutation {registerUser($input:              <-query
  (create: { userName:"u"           <- action
	           email: "e"             <- object
	           password: "p"})
 {                                   <= fields
  id
  userName
}
}

Pass this JSON in the body.
{ query: "
mutation registerUser($input: RegisterUserRequestInput)
{  registerUser(create: $input)
{
  id
  userName
}
}",

"variables":
{ "input": {"userName" : "loous",
             "email" : "sdddd",
              "password" : "dddd"}
}
}
Nope, use variables to pass in json objects, the only way
*/
function graphqlMutation(query, action, objectType, fields) {

  // note, need the exclmation point or the variables do not get sent.
  let graphqlQuery = "mutation " + query+ PL + "$input: " + objectType + "!" + PR;
  if (action) {
    graphqlQuery +=  CL + query + PL + action +":$input" + PR;
  }
  if (fields) {
    graphqlQuery += fields ;
  }

  graphqlQuery += CR;
  return graphqlQuery;
}

// make into doGraphMutation at some point
function gStore(mutation, object, fields) {
    const requestMutation =
          graphqlMutation(mutation,
                          "create",
                          object, // { username, password}  expands to json object.
                          fields //  " { id  type  userName emailAddress}"  string
                         );

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

  return axios(requestMutation)
    .then(handleResponse)
    .then(response => {return response.data.data[query]});;

}

function doGraphQuery(query,filters,fields) {
    const requestQuery =
          graphqlQueryRequest(query,  // type of object
                       filters, // { username, password}  expands to json object.
                       fields //  " { id  type  userName emailAddress}"  string
                      );

  return axios(requestQuery)
    .then(handleResponse)
    .then(response => {return response.data.data[query]});;
}


function gGetById(parameters) {
    const requestQuery =
        graphqlQuery('getBy',
                     parameters,
                     " { id  type  userName}"
                    );

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function gUpdate(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function gDelete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (response.status != 200) {
    if (response.status === 401) {
      // auto logout if 401 response returned from api
      logout();
      location.reload(true);
    }
    
    const error = (response && response.message) || response.statusText;
    return Promise.reject(error);
  }
  
  return response;
}
