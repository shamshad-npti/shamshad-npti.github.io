#include <stdio.h>
#define N 1001
int a[N];
void main() {
	int n, i, u, v, m;
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d", &u, &v);
		a[u]++;
		a[v]++;
	}
	for(i = 1; i <= n; i++) {
		printf("%d ", a[i]);
	}
	printf("\n");
}