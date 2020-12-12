import sys
import json
import subprocess

# test script to ensure we can receive the model and echo back data
obj = json.loads(str(sys.argv[1]))

for attribute, value in obj.items():
    print(attribute, str(value))

# Example Bash call from Python
# subprocess.run("./electron/dist/python/testScript.sh", shell=True, check=True)