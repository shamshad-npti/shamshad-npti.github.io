#include <stdio.h>
#define left(n) (n << 1)
#define right(n) ((n << 1) | 1)
#define parent(n) (n >> 1)
#define N 100005
int heap[N], n;
void swap(int i, int j) {
	heap[i] ^= heap[j];
	heap[j] ^= heap[i];
	heap[i] ^= heap[j];
}
void heapify(int k) {
	int m = k, l = left(k), r = right(k);
	if(l <= n && heap[m] < heap[l]) {
		m = l;
	}
	if(r <= n && heap[m] < heap[r]) {
		m = r;
	}
	if(m != k) {
		swap(m, k);
		heapify(m);
	}
}
void main() {
	int i;
	scanf("%d", &n);
	for(i = 1; i <= n; i++) {
		scanf("%d", heap + i);
	}
	for(i = (n + 1) / 2; i >= 1; i--)
		heapify(i);
	for(i = n; n > 1;) {
		swap(1, n);
		n--;
		heapify(1);
	}
	for(;n <= i; n++) {
		printf("%d ", heap[n]);
	}
	printf("\n");
}
