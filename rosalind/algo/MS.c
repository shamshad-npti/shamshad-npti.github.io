#include <stdio.h>
#define N 100005
#define INF 1e8
int a[N], lft[N], rgt[N];

void mergesort(int i, int j) {
	if(i + 1 >= j) return;
	int mid = (i + j) >> 1;
	mergesort(i, mid);
	mergesort(mid, j);
	int ls = mid - i, rs = j - mid, k, li = 0, ri = 0;
	for(k = 0; k < ls; k++) {
		lft[k] = a[i+k];
	}
	for(k = 0; k < rs; k++) {
		rgt[k] = a[mid+k];
	}
	lft[ls] = rgt[rs] = INF;
	for(k = i; k < j; k++) {
		if(lft[li] < rgt[ri]) {
			a[k] = lft[li];
			li++;
		} else {
			a[k] = rgt[ri];
			ri++;
		}
	}
}
void main() {
	int n, i;
	scanf("%d", &n);
	for(i = 0; i < n; i++) {
		scanf("%d", a + i);
	}
	mergesort(0, n);
	for(i = 0; i < n; i++) {
		printf("%d ", a[i]);
	}
	printf("\n");
}