#include <stdio.h>
#include <algorithm>
using namespace std;
typedef long long int ll;
constexpr int kN = int(5E2 + 10), kMod = int(1E9 + 7);

ll Pow(ll a, ll b) {
        ll ans = 1;
        while (b) {
                if (b & 1) ans = ans * a % kMod;
                a = a * a % kMod;
                b >>= 1;
        }
        return ans;
}

ll Rev(ll n) {return Pow(n, kMod - 2);}

ll graph[kN][kN];

int main() {
        int n, m, l, r;
        ll ans = 1, tmp;
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; i++) for (int j = 1; j <= n; j++) graph[i][j] = 0;
        for (int i = 1; i <= m; i++) {
                scanf("%d%d", &l, &r);
                graph[l][r]--;
                graph[l][l]++;
                graph[r][r]++;
                graph[r][l]--;
        }
        for (int i = 1; i <= n; i++) for (int j = 1; j <= n; j++) if (graph[i][j] < 0) graph[i][j] += kMod;
        n--;
        for (int i = 1; i <= n; i++) {
                if (graph[i][i] == 0) {
                        for (int j = i + 1; j <= n; j++) if (graph[j][i] != 0) {
                                if ((j - i) & 1) ans = kMod - ans;
                                for (int k = i; k <= n; k++) swap(graph[j][k], graph[i][k]);
                                break;
                        }
                }
                for (int j = i + 1; j <= n; j++) if (graph[j][i] != 0) {
                        tmp = kMod - (graph[j][i] * Rev(graph[i][i]) % kMod);
                        for (int k = i; k <= n; k++) graph[j][k] = (graph[j][k] + graph[i][k] * tmp) % kMod;
                }
        }
        for (int i = 1; i <= n; i++) ans = ans * graph[i][i] % kMod;
        printf("%lld\n", ans);
}