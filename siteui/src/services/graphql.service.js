import {config} from './config';
import { authHeader } from '../helpers';
const axios = require('axios');

export const graphqlService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
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


function graphqlQuery(query,parameters, fields) {
  return  {
    method: 'POST',
    url:`${config.apiUrl}/graphql`,
    header: "Content-Type: application/json",
    data: { "query" : graphql(query,
                              parameters,
                              fields),
            "variables":null,
            "operationName":null}
  }  
}

function graphqlMutation(query,parameters, fields) {
  return  {
    method: 'POST',
    url:`${config.apiUrl}/graphql`,
    header: "Content-Type: application/json",
    data: { "query" : graphql(query,
                              parameters,
                              fields),
            "variables":null,
            "operationName":null}
  }  
}

function graphql(query,parameters, fields) {

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

function graphqlMutation(mutation, request, object, fields) {

  let parameterList = [];
  for (var p in parameters) {
    parameterList.push(p + ':"'+parameters[p]+'"');
  }
  let graphqlQuery = "mutation " +CL + query + PL + request +":";
  if (object) {
    graphqlQuery +=  PL + parameterList.join(" ") + PR
  }
  graphqlQuery += fields + CR;
  
  return graphqlQuery;
}

function store(mutation, object, fields) {
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

function getAll(query,filters,fields) {
    const requestQuery =
          graphqlQuery(query,
                       filters, // { username, password}  expands to json object.
                       fields //  " { id  type  userName emailAddress}"  string
                      );

  return axios(requestQuery)
    .then(handleResponse)
    .then(response => {return response.data.data[query]});;
}
  
function getAllNew() {
  const requestQuery =
        graphqlQuery('getAllUsers',
                     null,
                     "{ id  type  userName email}"
                    );

  return axios(requestQuery)
    .then(handleResponse)
    .then(response => {return response.data.data.getAllUsers});;
}


function getById(parameters) {
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

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
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
