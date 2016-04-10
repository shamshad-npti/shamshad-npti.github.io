#include <stdio.h>
#define N 10001
void main() {
	int n, m, i, l, r, a[N], b[N];
	scanf("%d", &n);
	for(i = 0; i < n; i++) {
		scanf("%d", a + i);
	}
	scanf("%d", &m);
	for(i = 0; i < m; i++) {
		scanf("%d", b + i);
	}
	for(i = 0, l = 0, r = 0; i < m + n; i++) {
		if(l == n) {
			printf("%d ", b[r]);
			r++;
		} else if(r == m) {
			printf("%d ", a[l]);
			l++;
		} else if(a[l] < b[r]) {
			printf("%d ", a[l]);
			l++;
		} else {
			printf("%d ", b[r]);
			r++;
		}
	}
	printf("\n");
}