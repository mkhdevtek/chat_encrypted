import sys

input = sys.stdin.read
data = input().splitlines()

n, q = map(int, data[0].split())
p = list(map(int, data[1].split()))

res = [0] * n
stringg = ''

for i in range(2, 2 + q):
    s = list(map(int, data[i].split()))
    if s[0] == 0:
        for j in range(s[1], s[2] + 1):
            res[j - 1] += s[3]
    elif s[0] == 1:
        for j in range(s[1], s[2] + 1):
            res[p[j - 1] - 1] += s[3]
    elif s[0] == 2:
        r = 0
        for j in range(s[1], s[2] + 1):
            r += res[j - 1]
        stringg += str(r) + '\n'
    elif s[0] == 3:
        r = 0
        for j in range(s[1], s[2] + 1):
            r += res[p[j - 1] - 1]
        stringg += str(r) + '\n'

print(stringg)