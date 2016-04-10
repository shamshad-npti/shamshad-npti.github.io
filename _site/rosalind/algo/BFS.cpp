#include <stdio.h>
#include <memory.h>
#include <queue>
#define N 1004
using namespace std;

int main() {
	vector<int> g[N];
	int d[N], v[N], n, m, i, x, y;
	memset(d, -1, sizeof(d));
	memset(v, 0, sizeof(v));
	scanf("%d%d", &n, &m);
	for(i = 0; i < m; i++) {
		scanf("%d%d", &x, &y);
		g[x].push_back(y);
	}
	v[1] = 1;
	d[1] = 0;
	queue<int> q;
	q.push(1);
	while(!q.empty()) {
		x = q.front();
		q.pop();
		for(i = 0; i < g[x].size(); i++) {
			y = g[x][i];
			if(v[y]) continue;
			v[y] = true;
			d[y] = d[x] + 1;
			q.push(y);
		}
	}
	for(i = 1; i <= n; i++) {
		printf("%d ", d[i]);
	}
	printf("\n");
	return 0;
}