#include <stdio.h>
#include <memory.h>
#include <vector>
#define N 1004
using namespace std;
int t, vis[N], ord[N], n;
vector<int> g[N], r[N];
void dfs1(int u) {
	vis[u] = 1;
	for(int i = 0; i < g[u].size(); i++) {
		if(vis[g[u][i]]) continue;
		dfs1(g[u][i]);
	}
	ord[++t] = u;
}
void dfs2(int u) {
	vis[u] = 0;
	for(int i = 0; i < r[u].size(); i++) {
		if(!vis[r[u][i]]) continue;
		dfs2(r[u][i]);
	}
}
int dfs_loop() {
	int cnt = 0, i;
	for(i = 1; i <= n; i++) {
		if(vis[i]) continue;
		dfs1(i);
	}
	for(i = t; i > 0; i--) {
		if(!vis[i]) continue;
		dfs2(i);
		cnt++;
	}
	return cnt;
}
int main() {
	int m, i, u, v;
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d", &u, &v);
		g[u].push_back(v);
		g[v].push_back(u);
	}
	printf("%d\n", dfs_loop());
	return 0;
}