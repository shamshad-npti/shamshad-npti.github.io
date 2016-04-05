#include <stdio.h>
#include <memory.h>
#define N 1003
int g[N][N];
int cnt = 0, vis[N], n, m;
void dfs(int u) {
	vis[u] = 1;
	cnt++;
	int i;
	for(i = 1; i <= g[u][0]; i++) {
		if(vis[g[u][i]]) continue;
		dfs(g[u][i]);
	}
}

void main() {
	int t, i, u, v, flag;
	scanf("%d", &t);
	while(t--) {
		scanf("%d%d", &n, &m);
		memset(g, 0, sizeof(g));
		for(i = 0; i < m; i++) {
			scanf("%d%d", &u, &v);
			g[u][0]++;
			g[u][g[u][0]] = v;
		}
		flag = -1;
		for(i = 1; i <= n; i++) {
			cnt = 0;
			memset(vis, 0, sizeof(vis));
			dfs(i);
			if(cnt == n) {
				flag = i;
				break;
			}
		}
		printf("%d ", flag);
	}
	printf("\n");
}