# FelinePride

This projects demonstrates a prototype graphql endpoint and schema for 
FelinePride. A visualizer and graphiql query ui are provided.  

## Schema
The schema is a work in progress where the initial effort will be 
understanding the use cases, user conceptual model, and making it 
available at a single endpoint.

First steps will be building out query model and workflows.  

The next steps will focus on mutation workflows while continuing to 
enhance the query model.

The schema is located at src/main/resources/fp.graphql

## Running 

Clone the repository.

Cd to the fp-graphql directory.  Build with maven.

```mvn clean install```

Run the server.

```scripts/localstart.sh```

Browse the site.

```http://localhost:9080```
or 
  
```https://localhost:8443```

A graphql endpoint is available at ```/graphql``` with some basic
mocked up data.  (more work needs to be done on that data)

## Pointing to your data.

The fun begins when you begin to hook graphql to your datasources.

In ```/src/main/java/com/ibm/wce/graphql/api/graphql/GraphQLDataFetcherBuilder.java```, 
build out datafetchers to get data from APIs, databases, walmart labs, and more.

One could build out graphql as a service by making dynamic datafetchers 
using lambdas and other IoT integration tools.  Or you could fire
off a perl script.

## More information

Contact: lroehrs at gmail com.  Just a hint, the 
slack option will be faster.

## todo





