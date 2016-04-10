#include <stdio.h>
#include <memory.h>
#define N 402
void main() {
	int n, m, g[N][N], c[N][N], t, k, i, j, u, v, flag;
	scanf("%d", &t);
	while(t--) {
		scanf("%d%d", &n, &m);
		memset(g, 0, sizeof(g));
		memset(c, 0, sizeof(c));
		for(i = 0; i < m; i++) {
			scanf("%d%d", &u, &v);
			g[u][v] = g[v][u] = 1;
		}
		flag = 1;
		for(i = 1; i <= n && flag; i++) {
			for(j = 1; j <= n && flag; j++) {
				if(i == j || !g[i][j]) continue;
				for(k = j + 1; k <= n; k++) {
					if(k == i || !g[i][k]) continue;
					if(c[j][k]) {
						flag = 0;
						break;
					}
					c[j][k] = i;
				}
			}
		}
		if(flag) printf("-1 ");
		else printf("1 ");
	}
	printf("\n");
}