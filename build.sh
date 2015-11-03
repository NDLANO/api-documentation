#!/bin/bash

source ./build.properties

PROJECT=ndla/api-documentation
VER=v0.1
GIT_HASH=`git log --pretty=format:%h -n 1`

VERSION=${VER}_${GIT_HASH}

bower install
docker build -t $PROJECT:$VERSION .
