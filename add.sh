#!/bin/bash
flowprefix="// @flow"

find src | while read file; do
    if expr $file : ".*\.js" > /dev/null; then
        # echo $file;
        if [ -f $file ]; then
            read head < $file;
            # echo $head;
            if [ ! "$head" = "$flowprefix" ]; then
                sed -i '' '1s/^/\/\/ @flow\
/' "$file"
            fi;
        fi
    fi
done
