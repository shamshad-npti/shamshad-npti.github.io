#include <stdio.h>
#define N 100005
void main() {
	int n, m, left, find, right, mid, a[N], i;
	scanf("%d%d", &n, &m);
	for(i = 0; i < n; i++)
		scanf("%d", a + i);
	for(i = 0; i < m; i++) {
		scanf("%d", &find);
		left = 0;
		right = n;
		while(left < right) {
			mid = (left + right) / 2;
			if(a[mid] == find) { 
				printf("%d ", (mid + 1));
				break;
			}
			else if(a[mid] < find) left = mid + 1;
			else right = mid;
		}
		if(left == right)
			printf("-1 ");
	}
	printf("\n");
}