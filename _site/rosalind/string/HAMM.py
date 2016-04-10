s, t = raw_input(), raw_input()
print sum([1 if p != q else 0 for p, q in zip(s, t)])