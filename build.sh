#!/bin/bash

VERSION="$1"
source ./build.properties
PROJECT="$NDLAOrganization/$NDLAComponentName"

if [ -z $VERSION ]
then
    VERSION="SNAPSHOT"
fi

npm install
docker build -t $PROJECT:$VERSION .
echo "BUILT $PROJECT:$VERSION"
