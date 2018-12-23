import {config} from './config';
import { authHeader } from '../helpers';
const axios = require('axios');

export const userService = {
    login,
    logout,
    register,
    getAllUsers,
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

/* builds { query: getAllUsers {id type userName} } */
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

function login(userName, password) {
  
  const requestQuery =
        graphqlQueryRequest('login',
                    { userName, password },
                    "{ id  type  userName isAdmin}"
                   );

  return axios(requestQuery)
    .then(handleResponse)
    .then(response => {
      const user = response.data.data.login;
      if (user == null) { // login incorrect
        return null;
      }
      user.token = user.id;
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestMutationRequest =
          graphqlMutationRequest('registerUser',
                                 'create',
                                 { "input":user}, /// i mean really these stupid frameworks....
                                 'RegisterUserRequestInput',
                                 "{ id  type  userName}"
                                );
  
  return axios(requestMutationRequest)
    .then(handleResponse)
    .then(response => {
      const user = response.data.data.registerUser;
      if (user == null) { // login incorrect
        return null;
      }
      user.token = user.id;
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    });
  
//    return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
}

function getAllUsers(query,filters,fields) {
    const requestQuery =
          graphqlQueryRequest(query,
                       filters, // { username, password}  expands to json object.
                       fields //  " { id  type  userName emailAddress}"  string
                      );

  return axios(requestQuery)
    .then(handleResponse)
    .then(response => {return response.data.data[query]});;
}
  
function getAllNew() {
  const requestQuery =
        graphqlQueryRequest('getAllUsers',
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
    const requestMutationRequest =
          graphqlMutationRequest('deleteUser',
                                 'delete',
                                 { "input":{"id":id}}, /// i mean really these stupid frameworks....
                                 'DeleteRequestInput',
                                 "{ id }"
                                );
  return axios(requestMutationRequest).then(handleResponse);
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
