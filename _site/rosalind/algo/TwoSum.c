#include <stdio.h>
#define N 100003
void main() {
	int pos[N], neg[N], n, k, i, j, flag, p, q, r;
	scanf("%d%d", &k, &n);
	for(i = 0; i < k; i++) {
		for(j = 0; j < N; j++) {
			pos[j] = 0;
			neg[j] = 0;
		}
		flag = 0;
		p = 0;
		q = 0;
		for(j = 0; j < n; j++) {
			scanf("%d", &r);
			if(flag) continue;
			if(r < 0) {
				r = -r;
				if(pos[r]) {
					p = pos[r];
					q = j + 1;
					flag = 1;
				}
				neg[r] = j + 1;
			} else if(r == 0) {
				if(pos[r]) {
					flag = 1;
					p = pos[r];
					q = j + 1;
				}
				pos[r] = j + 1;
			} else {
				if(neg[r]) {
					p = neg[r];
					q = j + 1;
					flag = 1;
				}
				pos[r] = j + 1;
			}
		}
		if(flag) {
			printf("%d %d\n", p, q);
		} else {
			printf("-1\n");
		}
	}
}