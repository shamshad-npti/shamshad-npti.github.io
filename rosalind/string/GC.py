data = open('rosalind_gc.txt', 'r').read().split('\n')
dic = {}
last_id = -1
for s in data:
	if len(s) == 0: continue
	if s[0] == '>':
		last_id = int(s[-4:])
	elif last_id in dic:
		dic[last_id] = dic[last_id] + s
	else:
		dic[last_id] = s
sol = max([[100.0 * (dna.count('G') + dna.count('C')) / len(dna), dbx] for dbx, dna in dic.iteritems()])
print 'Rosalind_%04d %.8f%%' % (sol[1], sol[0])
