#!/bin/bash

curl --unix-socket "/var/run/docker.sock" "http://plass/containers/json?all=1&size=1" -v
