#!/bin/bash


if [ $# != 2 ]; then
    printf "ERROR: deploy.sh needs two arguments.\n./deploy.sh {PROJECT} {TARGET}\n";
    exit;
fi

PROJECT=$1
TARGET=$2
printf "\n- PROJECT: $PROJECT\n- TARGET:  $TARGET\nDo you really want to deploy it? [n/y]: "
read ny
if [ "$ny" != y ]; then
    exit
fi

printf "\n== Start deployment! ==\n"

case $TARGET in
    admin)
        rm -rf ./admin/dist
        cd admin && npm run build:$PROJECT && cd ..
        mv ./admin/dist/index.html ./functions/admin/$PROJECT/index.html
        firebase deploy --project=$PROJECT --only hosting:admin,functions:adminIndexHtml
        ;;
    client)
        rm -rf ./client/dist
        cd client && npm run build:$PROJECT && cd ..
        if [ $PROJECT == staging ]; then
            mv ./client/dist/index.html ./functions/client/$PROJECT/index.html
            firebase deploy --project=$PROJECT --only hosting:$PROJECT-client,functions:stgClientIndexHtml
        else
            firebase deploy --project=$PROJECT --only hosting:$PROJECT-client
        fi
        ;;
    functions)
        firebase deploy --project=$PROJECT --only functions
        ;;
    database)
        firebase deploy --project=$PROJECT --only database
        ;;
esac

printf "\n== End deployment! ==\n"
