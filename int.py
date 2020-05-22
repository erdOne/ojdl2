import sys

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

print(2);
i = input();
eprint(i);

