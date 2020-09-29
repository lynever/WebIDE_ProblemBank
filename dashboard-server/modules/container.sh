#!/bin/bash

curl --unix-socket "/var/run/docker.sock" "http://plass/containers/$1/$2"
