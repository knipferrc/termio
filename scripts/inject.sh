#!/bin/bash
cd ..
echo 'require("electron").webFrame.registerURLSchemeAsPrivileged("file")' | cat - $PWD/termio/build/*.js > temp && mv temp $PWD/termio/build/*.js
