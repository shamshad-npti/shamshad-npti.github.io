#include <stdio.h>
#define N 1001
int a[N];
void main() {
	int n, i, j, t, cmp = 0;
	scanf("%d", &n);
	for(i = 0; i < n; i++)
		scanf("%d", a + i);
	for(i = 1; i < n; i++) {
		j = i;
		while(j > 0 && a[j] < a[j - 1]) {
			t = a[j];
			a[j] = a[j-1];
			a[j-1] = t;
			j--;
			cmp++;
		}
	}
	printf("%d\n", cmp);
}