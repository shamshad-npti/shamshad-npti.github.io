#include <stdio.h>
#define N 100005
int n, a[N];
void swap(int *x, int *b) {
	int t = *x;
	*x = *b;
	*b = t;
}
int kth(int s, int e, int k) {
	int rn = s + rand() % (e - s), f, i;
	swap(a + rn, a + s);
	for(i = s + 1, f = s + 1; i < e; i++) {
		if(a[i] < a[s]) {
			swap(a + f, a + i);
			f++;
		}
	}
	f--;
	swap(a + f, a + s);
	if(f == k) return a[f];
	else if(f < k) return kth(f + 1, e, k);
	else return kth(s, f, k);
}
void main() {
	int i, k;
	srand(time(NULL));
	scanf("%d", &n);
	for(i = 0; i < n; i++)
		scanf("%d", a + i);
	scanf("%d", &k);
	printf("%d\n", kth(0, n, k - 1));
}