#include <stdio.h>
#include <memory.h>
#define N 1002
#define INF 0x0f0f0f0f
void main() {
	int g[N][N], dis[N], u, v, d, i, j, m, n, mrk[N], mn;
	memset(g, -1, sizeof(g));
	memset(mrk, 0, sizeof(mrk));
	memset(dis, 0x0f, sizeof(dis));
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d%d", &u, &v, &d);
		g[u][v] = d;
	}
	dis[1] = 0;
	for(i = 0; i < n; i++) {
		mn = -1;
		for(j = 1; j <= n; j++) {
			if(mrk[j] || (dis[j] == INF)) continue;
			else if(mn == -1) mn = j;
			else if(dis[j] < dis[mn]) mn = j;
		}
		if(mn == -1) break;
		mrk[mn] = 1;
		for(j = 1; j <= n; j++) {
			if(mrk[j]) continue;
			if(g[mn][j] != -1 && dis[mn] + g[mn][j] < dis[j]) {
				dis[j] = dis[mn] + g[mn][j];
			}
		}
	}
	for(j = 1; j <= n; j++) {
		printf("%d ", (dis[j] == INF) ? -1: dis[j]);
	}
	printf("\n");
}