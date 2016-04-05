#include <stdio.h>
#define N 100005
int n, a[N];
void swap(int *x, int *b) {
	int t = *x;
	*x = *b;
	*b = t;
}
void kth(int s, int e) {
	if(s + 1 >= e) return;
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
	kth(s, f);
	kth(f + 1, e);
}
void main() {
	int i;
	srand(time(NULL));
	scanf("%d", &n);
	for(i = 0; i < n; i++)
		scanf("%d", a + i);
	kth(0, n);
	for(i = 0; i < n; i++) {
		printf("%d ", a[i]);
	}
	printf("\n");
}