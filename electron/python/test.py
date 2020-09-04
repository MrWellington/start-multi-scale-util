import sys
import json

obj = json.loads(str(sys.argv[1]))

for attribute, value in obj.items():
    print(attribute, str(value))