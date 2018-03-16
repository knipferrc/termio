#!/bin/bash
cd ..
echo 'require("electron").webFrame.registerURLSchemeAsPrivileged("file")' | cat - $PWD/recode/build/*.js > temp && mv temp $PWD/recode/build/*.js
