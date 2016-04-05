#include <stdio.h>
#include <memory.h>
#define N 1004
#define M N * N
#define INF 0x0f0f0f0f
#define min(a, b) (a < b ? a : b)
int e[M][3], g[N][N], vis[N];
int sum(int a, int b) {
	return a == INF || b == INF ? INF : a + b;
}
void dfs(int u) {
	vis[u] = 1;
	int i;
	for(i = 1; i <= g[u][0]; i++) {
		if(vis[g[u][i]]) continue;
		dfs(g[u][i]);
	}
}
void main() {
	int dis[N], n, m, i, k, j, t, flag, u, v, d;
	scanf("%d", &t);
	while(t--) {		
		scanf("%d%d", &n, &m);
		memset(g, 0, sizeof(g));
		memset(vis, 0, sizeof(vis));
		for(i = 0; i < m; i++) {
			scanf("%d%d%d", &u, &v, &d);
			e[i][0] = u;
			e[i][1] = v;
			e[i][2] = d;
			g[u][0]++;
			g[u][g[u][0]] = v;
		}
		for(i = 1, flag = -1; i <= n && flag == -1; i++) {
			if(vis[i] || g[i][0] == 0) continue;
			dfs(i);
			memset(dis, 0x0f, sizeof(dis));
			dis[i] = 0;
			for(j = 1; j < n; j++) {
				for(k = 0; k < m; k++) {
					dis[e[k][1]] = min(dis[e[k][1]], sum(dis[e[k][0]], e[k][2]));
				}
			}
			for(k = 0; k < m; k++) {
				if(sum(dis[e[k][0]], e[k][2]) < dis[e[k][1]]) {
					flag = 1;
					break;
				}
			}
		}
		printf("%d ", flag);
	}
	printf("\n");
}