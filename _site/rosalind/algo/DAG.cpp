#include <stdio.h>
#include <memory.h>
#include <vector>
#define N 1004
using namespace std;
vector<int> g[N];
int mark[N], n;
int dfs(int u) {
	mark[u] = 1;
	for(int i = 0; i < g[u].size(); i++) {
		if(mark[g[u][i]] == 1) return 1;
		if(mark[g[u][i]]) continue;
		if(dfs(g[u][i])) return 1;
	}
	mark[u] = 2;
	return 0;
}
int dfs_loop() {
	memset(mark, 0, sizeof(mark));
	for(int i = 1; i <= n; i++) {
		if(mark[i]) continue;
		if(dfs(i)) return -1;
	}
	return 1;
}

int main() {
	int k, i, m, j, u, v;
	scanf("%d", &k);
	for(i = 0; i < k; i++) {
		scanf("%d%d", &n, &m);
		for(j = 1; j <= n; j++) {
			g[j].clear();
		}
		for(j = 1; j <= m; j++) {
			scanf("%d%d", &u, &v);
			g[u].push_back(v);
		}
		printf("%d ", dfs_loop());
	}
	printf("\n");
	return 0;
}