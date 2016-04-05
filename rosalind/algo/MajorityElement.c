#include <stdio.h>
#define N 10001
void main() {
	int n, k, x, y, i, a[N];
	scanf("%d%d", &k, &n);
	while(k--) {
		for(i = 0, x = 0, y = 0; i < n; i++) {
			scanf("%d", a + i);
			if(a[i] == x) {
				y++;
			} else if(y > 0) {
				y--;
			} else {
				x = a[i];
				y = 1;
			}
		}
		for(i = 0, y = 0; i < n; i++) {
			if(a[i] == x) { y++; }
		}
		if(2 * y > n) {
			printf("%d ", x);
		} else {
			printf("-1 ");
		}
	}
	printf("\n");
}