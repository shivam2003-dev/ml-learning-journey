import json
from .core import demo
def main(): print(json.dumps(demo(), indent=2))
if __name__ == '__main__': main()
