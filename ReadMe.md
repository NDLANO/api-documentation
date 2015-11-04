# API Documentation 
Shows documentation for apis from NDLA.
Also contains testclients for the apis.

# Prerequisites - Installing NPM and Bower 
## Install NPM
    # osx 
    brew install npm
     
    # Windows - find out for yourself
    # Linux
        ## Ubuntu:
        apt-get install npm
        ## Arch:
        pacman -S npm

# Building and distribution

## Create Docker Image
    ./build.sh

You need to have a docker daemon running locally. Ex: [boot2docker](http://boot2docker.io/)

## Deploy Docker Image to Amazon (via DockerHub)
    ndla deploy <env> api-documentation

