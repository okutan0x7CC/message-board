import os
import json

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

print(".env generation complete!")
