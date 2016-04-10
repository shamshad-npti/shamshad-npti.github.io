#include <stdio.h>
#include <vector>
#define N 1004
using namespace std;
int t, vis[N], ord[N];
vector<int> g[N];
void dfs(int u) {
	int i;
	vis[u] = 1;
	for(i = 0; i < g[u].size(); i++) {
		if(vis[g[u][i]]) continue;
		dfs(g[u][i]);
	}
	ord[t++] = u;
}
void main() {

}