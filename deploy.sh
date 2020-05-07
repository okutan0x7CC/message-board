#!/bin/bash

printf "\nPlease select a deployment destination.\n"
PS3="Enter a number: "
select env in staging production; do
    case $env in
        staging) printf "\n⭐️ Selected destination: $env ⭐️\n" ;;
        production) printf "\n🚨 Selected destination: $env 🚨\n" ;;
        *) continue ;;
    esac

    printf "\nPlease select a target.\n"
    select target in admin_and_function client projection database; do

        # final confirmation
        if [ -n "$target" ]; then
            printf "\nSelected\n - Destination: $env\n - Target: $target\n\nDo you really want to deploy it?\n"
            select yn in Yes No; do
                case $yn in
                    Yes) break ;;
                    No) exit ;;
                    *) continue ;;
                esac
            done
        else
            continue
        fi

        printf "\n== 🛎  Start deployment! ==\n"
        
        case $target in
            admin_and_function)
                rm -rf ./admin/dist && rm -rf ./functions/admin/*
                cd admin && npm run build && cd ..
                mv ./admin/dist/index.html ./functions/admin/index.html
                firebase deploy --project=$env --only hosting:admin,functions:adminIndexHtml
                ;;
            client)
                rm -rf ./client/dist
                cd client && npm run build && cd ..
                firebase deploy --project=$env --only hosting:client
                ;;
            projection)
                rm -rf ./projection/dist
                cd projection && npm run build && cd ..
                firebase deploy --project=$env --only hosting:projection
                ;;
            database)
                firebase deploy --project=$env --only database
                ;;
        esac
        break
    done

    break
done

printf "\n== 🍺 End deployment! ==\n"
