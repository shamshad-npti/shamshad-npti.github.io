#include <stdio.h>
#define N 1001
int g[N][N];
void main() {
	int n, i, u, v, m, deg, j;
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d", &u, &v);
		g[u][0]++;
		g[v][0]++;
		g[u][g[u][0]] = v;
		g[v][g[v][0]] = u;
	}
	for(i = 1; i <= n; i++) {
		for(j = 1, deg = 0; j <= g[i][0]; j++) {
			deg += g[g[i][j]][0];
		}
		printf("%d ", deg);
	}
	printf("\n");
}