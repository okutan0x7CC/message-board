#!/bin/bash

echo "\nPlease select a deployment destination.\n"
PS3="Enter a name: "
destination=""
select env in staging production; do
    if [ -n "$REPLY" ]; then
        if [ $REPLY = "staging" ]; then
            destination="staging"
        elif [ $REPLY = "production" ]; then
            destination="production"
        else
            echo "Invalid!"
            continue
        fi
    else
        echo "Invalid!"
        continue
    fi
    break
done

echo "\n🔥 Start deploying $destination !\n"

rm -rf ./dist && rm -rf ./functions/admin/*
npm run build
mv ./dist/index.html ./functions/admin/index.html
firebase deploy --project=$destination --only hosting:$destination,functions

echo "\n🍺 End deployment!\n"
