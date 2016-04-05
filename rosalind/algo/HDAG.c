#include <stdio.h>
#include <memory.h>
#define N 1005
int g[N][N], e[N][N], t, vis[N], sorted[N], n, m;
void dfs(int u) {
	vis[u] = 1;
	int i;
	for(i = 1; i <= g[u][0]; i++) {
		if(vis[g[u][i]]) continue;
		dfs(g[u][i]);
	}
	sorted[++t] = u;
}
int verify() {
	int i, u = sorted[n], v;
	for(i = n - 1; i > 0; i--) {
		v = sorted[i];
		if(!e[u][v]) return 0;
		u = v;
	}
	return 1;
}
void main() {
	int k, i, u, v, flag;
	scanf("%d", &k);
	while(k--) {
		scanf("%d%d", &n, &m);
		memset(g, 0, sizeof(g));
		memset(e, 0, sizeof(e));
		for(i = 0; i < m; i++) {
			scanf("%d%d", &u, &v);
			g[u][0]++;
			g[u][g[u][0]] = v;
			e[u][v] = 1;
		}
		flag = -1;
		for(i = 1; i <= n; i++) {
			memset(vis, 0, sizeof(vis));
			memset(sorted, 0, sizeof(sorted));
			t = 0;
			dfs(i);
			if(t == n && verify()) {
				flag = 1;
				break;
			}
		}
		printf("%d ", flag);
		if(flag == 1) {
			for(i = n ; i > 0; i--)
				printf("%d ", sorted[i]);
		}
		printf("\n");
	}
	}