#include <stdio.h>
#include <memory.h>
#include <vector>
#define N 1004
using namespace std;
vector<int> g[N];
int mark[N], sorted[N], t, n;
void dfs(int u) {
	mark[u] = 1;
	for(int i = 0; i < g[u].size(); i++) {
		if(mark[g[u][i]]) continue;
		dfs(g[u][i]);
	}
	sorted[t++] = u;
}
void dfs_loop() {
	memset(mark, 0, sizeof(mark));
	for(int i = 1; i <= n; i++) {
		if(mark[i]) continue;
		dfs(i);
	}
}

int main() {
	int m, i, u, v;
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d", &u, &v);
		g[u].push_back(v);
	}
	dfs_loop();
	for(i = n - 1; i >= 0; i--) {
		printf("%d ", sorted[i]);
	}
	printf("\n");
	return 0;
}