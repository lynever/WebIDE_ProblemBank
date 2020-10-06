#!/bin/bash

CODER_NAME="$1"
HOME="$2"
CODER_PORT="$3" 

echo $CODER_NAME
echo $HOME
echo $CODER_PORT

# CODER_PASS="$3" 
if [ -z "$CODER_NAME" ]; then
  echo 'Set your host name to $CODER_NAME: eg. example.com' 1>&2
  exit 1
fi

# if [ -z "$CODER_PASS" ]; then
#   echo 'Set your password to $CODER_PASS' 1>&2
#   exit 1
# fi

# Change directory to here
cd "$(dirname "$0")"

# # Dirs and files
mkdir -p "$HOME/code-server"     # Root dir shared with Coder
# # mkdir -p "$HOME/.local/share/code-server" # Coder's config dir
# # touch "$HOME/.gitconfig"                  # Git configs".

mkdir -p "$HOME/projects"

# cp -r "$PWD/code-server" "$PWD/$HOME" 



# Installing gcc compiler
cat << EOF > /etc/apt/sources.list
#deb http://snapshot.debian.org/archive/debian/20200514T145000Z buster main
deb http://deb.debian.org/debian buster main restricted universe multiverse
#deb http://snapshot.debian.org/archive/debian-security/20200514T145000Z buster main
deb http://security.debian.org/debian-security buster/updates main restricted universe multiverse
#deb http://snapshot.debian.org/archive/debian/20200514T145000Z buster-updates main
deb http://deb.debian.org/debian buster-updates main restricted universe multiverse
EOF

# Build and run
docker build -t ide .
docker run \
  --name $CODER_NAME \
  --detach \
  --restart unless-stopped \
  --user 0:0 \
  --mount type=bind,source="$PWD/$HOME/projects",target="/home/coder/projects" \
  --publish ${CODER_PORT:=8081}:8080 \
  ide \

  # --mount type=bind,source="$PWD/$HOME/code-server",target="/usr/lib/projects" \

# --mount type=bind,source="C:/Users/PLASS/Desktop/vs-ide/project-servce2/modules/$HOME/.local/share/code-server",target="/home/coder/.local/share/code-server"

# docker cp $PWD/.dockerignore $CODER_NAME:/usr/lib/code-server
# container -> local
# COPY local -> container
# docker cp $CODER_NAME:/usr/lib/code-server $PWD/$HOME/code-server

# docker cp $CODER_NAME:/usr/lib/code-server/dist $PWD/$HOME/code-server
# docker cp $CODER_NAME:/usr/lib/code-server/lib $PWD/$HOME/code-server
# docker cp $CODER_NAME:/usr/lib/code-server/out $PWD/$HOME/code-server
# docker cp $CODER_NAME:/usr/lib/code-server/src $PWD/$HOME/code-server

  # --mount type=bind,source="$PWD/$HOME/projects",target="/home/coder/projects" \

  # --user $(id -u):$(id -g) \

  # --env PASSWORD="$CODER_PASS" \
  # --workdir "/home/coder/projects" \
  # --mount type=bind,source="C:/Users/PLASS/Desktop/vs-ide/project-servce2/modules/$HOME/.local/share/code-server",target="/home/coder/.local/share/code-server" \
  # --mount type=bind,source="C:/Users/PLASS/Desktop/vs-ide/project-servce2/modules/$HOME/.gitconfig",target="/home/coder/.gitconfig" \