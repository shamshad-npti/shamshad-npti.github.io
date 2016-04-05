#include <stdio.h>
#define N 200003
void main() {
	int pos[N][3], neg[N][3], num[N], n, k, i, j, flag, p, q, r, x, y;
	scanf("%d%d", &k, &n);
	for(i = 0; i < k; i++) {
		for(j = 0; j < N; j++) {
			pos[j][0] = 0;
			neg[j][0] = 0;
		}
		flag = 0;
		p = 0;
		q = 0;
		for(j = 0; j < n; j++) {
			scanf("%d", num + j);
			if(flag) continue;
			if(num[j] <= 0) {
				if(pos[-num[j]][0]) {
					flag = 1;
					p = pos[-num[j]][1];
					q = pos[-num[j]][2];
					r = j + 1;
				}
			} else {
				if(neg[num[j]][0]) {
					flag = 1;
					p = neg[num[j]][1];
					q = neg[num[j]][2];
					r = j + 1;
				}
			}
			for(x = j - 1; x >= 0; x--) {
				y = num[x] + num[j];
				if(y < 0) {
					y = -y;
					neg[y][0] = 1;
					neg[y][1] = x + 1;
					neg[y][2] = j + 1;
				} else {
					pos[y][0] = 1;
					pos[y][1] = x + 1;
					pos[y][2] = j + 1;
				}
			}
		}
		if(flag) {
			printf("%d %d %d\n", p, q, r);
		} else {
			printf("-1\n");
		}
	}
}