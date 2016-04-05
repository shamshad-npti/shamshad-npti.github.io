// ConnectedComponent
#include <stdio.h>
#include <vector>
#define N 1002
using namespace std;
vector<int> g[N];
int n, m, vis[N];
void dfs(int u) {
	vis[u] = 1;
	for(int i = 0; i < g[u].size(); i++) {
		if(vis[g[u][i]]) continue;
		dfs(g[u][i]);
	}
}
int dfs_loop() {
	int cnt = 0;
	for(int i = 1; i <= n; i++) {
		if(!vis[i]) { 
			cnt++;
			dfs(i);
		}
	}
	return cnt;
}
int main() {
	scanf("%d%d", &n, &m);
	int i, u, v;
	for(i = 0; i < m; i++) {
		scanf("%d%d", &u, &v);
		g[u].push_back(v);
		g[v].push_back(u);
	}
	printf("%d\n", dfs_loop());
	return 0;
}