#!/bin/sh
echo Starting IBM WCE GraphQL Server Locally In Debug Mode: Port 9080
echo Requires Java 8
cd  ../target 2> /dev/null
cd  target  2> /dev/null
cd  ../

echo `pwd`

java -Xmx3096m -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=9010 -Dcom.sun.management.jmxremote.local.only=false -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false -Xdebug -Xnoagent -DDTDebug=2 -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,address=5000,suspend=n -Dfile.encoding=UTF-8 -jar target/wce-graphql-0.1.0-SNAPSHOT.jar server  wce-graphql.yaml 2>&1 &
