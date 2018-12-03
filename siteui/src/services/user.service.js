import {config} from './config';
import { authHeader } from '../helpers';
const axios = require('axios');

export const userService = {
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

function login(userName, password) {
  
  const requestQuery =
        graphqlQuery('login',
                    { userName, password },
                    "{ id  type  userName}"
                   );
  return axios(requestQuery)
    .then(handleResponse)
    .then(response => {
      const user = response.data.data.login;
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
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
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
