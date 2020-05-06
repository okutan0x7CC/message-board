#!/bin/bash

printf "\nPlease select a deployment destination.\n"
PS3="Enter a number: "
select env in staging production quit; do
    case $env in
        staging)
            printf "\n⭐️ Selected destination: $env ⭐️\n"
            ;;
        production)
            printf "\n🚨 Selected destination: $env 🚨\n"
            ;;
        quit)
            exit
            ;;
        *)
            printf "Invalid option $REPLY\n"
            continue
            ;;
    esac

    printf "\nPlease select a target.\n"
    PS3="Enter a number: "
    select target in admin_and_functions client projection database; do
        case $target in
            admin_and_functions)
                printf "Target: $target"
                rm -rf ./admin/dist && rm -rf ./functions/admin/*
                cd admin && npm run build && cd ..
                mv ./admin/dist/index.html ./functions/admin/index.html
                firebase deploy --project=$env --only hosting:admin,functions
                ;;
            client)
                printf "Target: $target"
                rm -rf ./client/dist
                cd client && npm run build && cd ..
                firebase deploy --project=$env --only hosting:client
                ;;
            projection)
                printf "Target: $target"
                rm -rf ./projection/dist
                cd projection && npm run build && cd ..
                firebase deploy --project=$env --only hosting:projection
                ;;
            database)
                printf "Target: $target"
                firebase deploy --project=$env --only database
                ;;
            quit)
                exit
                ;;
            *)
                printf "Invalid option $REPLY\n"
                continue
                ;;
        esac
        break
    done

    break
done

printf "\n🍺 End deployment!\n"
