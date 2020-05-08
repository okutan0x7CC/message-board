#!/bin/bash

PS3="Enter a number: "

# select deployment destination
DESTINATION=""
printf "\nPlease select a deployment destination.\n"
select destination in staging production; do
    case $destination in
        staging)  ;;
        production) ;;
        *) continue ;;
    esac
    DESTINATION=$destination
    printf "\n ⊙ Selected destination: $DESTINATION\n"
    break
done

# select deployment target
TARGET=""
printf "\nPlease select a deployment target.\n"
select target in admin_and_function client projection database; do
    case $target in
        admin_and_function) ;;
        client) ;;
        projection) ;;
        database) ;;
        *) continue ;;
    esac
    TARGET=$target
    printf "\n ⊙ Selected target: $TARGET\n"
    break
done

# final confirmation
printf "\nFinal confirmation\n ⊙ Destination: $DESTINATION\n ⊙ Target: $TARGET\nDo you really want to deploy it?\n"
select yn in Yes No; do
    case $yn in
        Yes) 
            printf "\n ⊙ Selected answer: $yn\n"
            break
            ;;
        No) 
            printf "\n ⊙ Selected answer: $yn\n"
            exit
            ;;
        *) continue ;;
    esac
done

printf "\n== Start deployment! ==\n"

case $TARGET in
    admin_and_function)
        rm -rf ./admin/dist && rm -rf ./functions/admin/*
        cd admin && npm run build && cd ..
        mv ./admin/dist/index.html ./functions/admin/index.html
        firebase deploy --project=$DESTINATION --only hosting:admin,functions:adminIndexHtml
        ;;
    client)
        rm -rf ./client/dist
        cd client && npm run build && cd ..
        firebase deploy --project=$DESTINATION --only hosting:client
        ;;
    projection)
        rm -rf ./projection/dist
        cd projection && npm run build && cd ..
        firebase deploy --project=$DESTINATION --only hosting:projection
        ;;
    database)
        firebase deploy --project=$DESTINATION --only database
        ;;
esac

printf "\n== End deployment! ==\n"
