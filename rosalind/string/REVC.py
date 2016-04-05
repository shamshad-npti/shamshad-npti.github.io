dic = {'A':'T', 'C': 'G', 'G': 'C', 'T': 'A'}
trn = reversed([dic[c] for c in raw_input()])
print ''.join(trn)