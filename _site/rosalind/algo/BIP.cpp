#include <stdio.h>
#include <vector>
#include <memory.h>
#define N 1002
using namespace std;
vector<int> g[N];
int color[N], mark[N], n;
int dfs(int u, int c) {
	color[u] = c;
	mark[u] = 1;
	for(int i = 0; i < g[u].size(); i++) {
		int v = g[u][i];
		if(mark[v]) {
			if(color[v] == c) return 1;
			continue;
		}
		if(dfs(v, 1 - c)) return 1;
	}
	return 0;
}
int dfs_loop() {
	memset(mark, 0, sizeof(mark));
	memset(color, -1, sizeof(color));
	for(int i = 1; i <= n; i++) {
		if(mark[i]) continue;
		if(dfs(i, 0)) return -1;
	}
	return 1;
}
int main() {
	int k, i, j, u, v, m;
	scanf("%d", &k);
	for(i = 0; i < k; i++) {
		scanf("%d%d", &n, &m);
		for(j = 1; j <= n; j++) {
			g[j].clear();
		}
		for(j = 1; j <= m; j++) {
			scanf("%d%d", &u, &v);
			g[u].push_back(v);
			g[v].push_back(u);
		}
		printf("%d ", dfs_loop());
	}
	printf("\n");
	return 0;
}