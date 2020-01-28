#include <bits/stdc++.h>
using namespace std;

const int kMod = 1'000'000'000 + 7;
const int kN = 500 + 5;
int a[kN][kN];

int fpow(int a, int n) {
    int res = 1;
    while (n > 0) {
        if (n & 1) res = 1LL * res * a % kMod;
        a = 1LL * a * a % kMod;
        n >>= 1;
    }
    return res;
}

int main() {
    int n, m; scanf("%d%d", &n, &m);
    for (int i = 0; i < m; ++i) {
        int u, v; scanf("%d%d", &u, &v);
        u--, v--;
        a[u][u]++, a[v][v]++;
        a[u][v] = kMod - 1;
        a[v][u] = kMod - 1;
    }
    int det = 1;
    for (int i = 0; i < n - 1; ++i) {
        int p = -1;
        for (int j = i; j < n - 1; ++j) {
            if (a[j][i] > 0) p = j;
        }
        if (p == -1) continue;
        if (p != i) det = kMod - det;
        for (int k = 0; k < n - 1; ++k) swap(a[i][k], a[p][k]);
        for (int j = 0; j < n - 1; ++j) {
            if (i == j) continue;
            int z = 1LL * a[j][i] * fpow(a[i][i], kMod - 2) % kMod;
            for (int k = 0; k < n - 1; ++k) (a[j][k] += kMod - 1LL * z * a[i][k] % kMod) %= kMod;
        }
    }
    for (int i = 0; i < n - 1; ++i) det = 1LL * det * a[i][i] % kMod;
    printf("%d\n", det);
    return 0;
}
