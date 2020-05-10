import os
import json
from os import path

print("\n.env generation start.\nloading firebase functions:config...")

env_data = []
file_name = "tmp.env.json"
os.system(f"firebase functions:config:get > {file_name}")
with open(file_name) as file:
    env_data = json.load(file)["env"]

print(f"{file_name} has been created.\n.env generating...")

env_content = "# This .env is automatically generated.\n# If you want to change it, please refer to the following.\n# https://firebase.google.com/docs/functions/config-env\n\n"
for key, value in env_data.items():
    env_content += f"{key.upper()}={value}\n"

target_directory = ["admin", "client", "database", "projection"]
for directory in target_directory:
    with open(f"./{directory}/.env", "w") as file:
        file.write(env_content)

print(".env generation complete!\ndatabase.rules.json editing...")

if (path.exists("./database/database.rules.json")):
    rules_data = {}
    with open("./database/database.rules.json") as file:
        rules_data = json.load(file)
        admin_email_regex = env_data["admin_email_regex"]
        rules_data["rules"][".read"] = f"auth.token.email.matches({admin_email_regex})"
        rules_data["rules"][".write"] = f"auth.token.email.matches({admin_email_regex})"
    with open("./database/database.rules.json", "w") as file:
        json.dump(rules_data, file, indent=2)
else:
    print("database.rules.json not found.")

print("python generate_env.py complete!")
