#include <stdio.h>
#define N 100005
void swap(int *a, int *b) {
	int t = *a;
	*a = *b;
	*b = t;
}
void main() {
	int n, a[N], i, f, t;
	scanf("%d", &n);
	for(i = 0; i < n; i++)
		scanf("%d", a + i);
	for(i = 1, f = 1; i < n; i++) {
		if(a[i] < a[0]) {
			swap(a + f, a + i);
			f++;
		}
	}
	swap(a + f - 1, a);
	for(i = 0; i < n; i++) {
		printf("%d ", a[i]);
	}
	printf("\n");
}