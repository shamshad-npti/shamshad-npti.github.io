#include <stdio.h>
#include <memory.h>
#include <vector>
#define N 100005
#define INF 0x0f0f0f0f
using namespace std;
vector<pair<int, int> > g[N];
int mark[N], sorted[N], t, n;
void dfs(int u) {
	mark[u] = 1;
	for(int i = 0; i < g[u].size(); i++) {
		if(mark[g[u][i].first]) continue;
		dfs(g[u][i].first);
	}
	sorted[t++] = u;
}
int min(int a, int b) {
	return a < b ? a : b;
}
int main() {
	int m, i, j, u, v, d, dis[N];
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d%d", &u, &v, &d);
		g[u].push_back(make_pair(v, d));
	}
	memset(dis, 0x0f, sizeof(dis));
	dfs(1);
	dis[1] = 0;
	for(i = t - 1; i >= 0; i--) {
		u = sorted[i];
		for(j = 0; j < g[u].size(); j++) {
			v = g[u][j].first;
			d = g[u][j].second;
			dis[v] = min(dis[v], dis[u] + d);
		}
	}
	for(i = 1; i <= n; i++) {
		if(i - 1) printf(" ");
		if(!mark[i]) printf("x");
		else printf("%d", dis[i]);
	}
	printf("\n");
	return 0;
}