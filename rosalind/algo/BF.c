#include <stdio.h>
#include <memory.h>
#define N 1004
#define M N * N
#define INF 0x0f0f0f0f
#define min(a, b) (a < b ? a : b)
int g[M][3];
void main() {
	int dis[N], n, m, i, j;
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d%d", g[i], g[i] + 1, g[i] + 2);
	}
	memset(dis, 0x0f, sizeof(dis));
	dis[1] = 0;
	for(i = 1; i < n; i++) {
		for(j = 0; j < m; j++) {
			if(dis[g[j][0]] == INF) continue;
			dis[g[j][1]] = min(dis[g[j][1]], dis[g[j][0]] + g[j][2]);
		}
	}
	for(i = 1; i <= n; i++) {
		if(i-1) printf(" ");
		if(dis[i] == INF) printf("x");
		else printf("%d", dis[i]);
	}
	printf("\n");
}