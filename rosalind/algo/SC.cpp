// Semi Connected Component
#include <stdio.h>
#include <memory.h>
#include <vector>
#define N 1004
using namespace std;
int t, vis[N], ord[N], n, cnt, vert[N];
int tg[N][N], te[N][N], sorted[N], g[N][N], r[N][N];

void dfs1(int u) {
	vis[u] = 1;
	for(int i = 1; i <= g[u][0]; i++) {
		if(vis[g[u][i]]) continue;
		dfs1(g[u][i]);
	}
	ord[++t] = u;
}

void dfs2(int u) {
	vis[u] = 0;
	for(int i = 1; i <= r[u][0]; i++) {
		if(!vis[r[u][i]]) continue;
		dfs2(r[u][i]);
	}
	vert[u] = cnt;
}
void dfs(int u) {
	vis[u] = 1;
	for(int i = 1; i <= tg[u][0]; i++) {
		if(vis[tg[u][i]]) continue;
		dfs(tg[u][i]);
	}
	sorted[++t] = u;
}
int verify() {
	int i, u = sorted[t], v;
	for(i = t - 1; i > 0; i--) {
		v = sorted[i];
		if(!te[u][v]) return 0;
		u = v;
	}
	return 1;	
}
void dfs_loop() {
	int i;
	for(i = 1; i <= n; i++) {
		if(vis[i]) continue;
		dfs1(i);
	}
	for(i = t, cnt = 0; i > 0; i--) {
		if(!vis[ord[i]]) continue;
		cnt++;
		dfs2(ord[i]);
	}
}
int main() {
	int m, i, j, u, v, k, flag;
	scanf("%d", &k);
	while(k--) {
		scanf("%d%d", &n, &m);
		memset(g, 0, sizeof(g));
		memset(r, 0, sizeof(r));
		memset(vis, 0, sizeof(vis));
		memset(ord, 0, sizeof(ord));
		t = 0;
		for(i = 0; i < m; i++) {
			scanf("%d%d", &u, &v);
			g[u][0]++;
			r[v][0]++;
			g[u][g[u][0]] = v;
			r[v][r[v][0]] = u;
		}
		dfs_loop();
		memset(tg, 0, sizeof(tg));
		memset(te, 0, sizeof(te));
		for(i = 1; i <= n; i++) {
			u = vert[i];
			for(j = 1; j <= g[i][0]; j++) {
				v = vert[g[i][j]];
				if(u == v || te[u][v]) continue;
				tg[u][0]++;
				tg[u][tg[u][0]] = v;
				te[u][v] = 1;
			}
		}
		flag = -1;
		for(i = 1; i <= cnt; i++) {
			memset(vis, 0, sizeof(vis));
			memset(sorted, 0, sizeof(sorted));
			t = 0;
			dfs(i);
			if(t == cnt && verify()) {
				flag = 1;
				break;
			}
		}
		printf("%d ", flag);
	}
	printf("\n");
	return 0;
}