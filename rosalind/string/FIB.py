n, t = map(int, raw_input().split())
f1, f2 = 1, 1
f3 = 1
n -= 2
while n != 0:
	f3 = f2 + t * f1
	f1 = f2
	f2 = f3
	n -= 1
print f3
