def compute_prefix(s):
	m = len(s)
	p = [0 for i in range(m)]
	p[0] = -1
	k = -1
	for q in range(1, m):
		while k > -1 and s[k + 1] != s[q]:
			k = p[k]
		if s[k + 1] == s[q]:
			k = k + 1
		p[q] = k
	return p

fl = open('rosalind_subs.txt')
s, t = fl.readline(), fl.readline()
if s[-1] == '\n':
	s = s[0:-1]
if t[-1] == '\n':
	t = t[0:-1]
prefix = compute_prefix(t)
n = len(s)
m = len(t)
q = -1
out = []
for i in range(n):
	while q > -1 and t[q + 1] != s[i]:
		q = prefix[q]
	if t[q + 1] == s[i]:
		q += 1
	if q == m - 1:
		out.append(str(i + 2 - m))
		q = prefix[q]
print ' '.join(out)