#include <bits/stdc++.h>
#define debug(x) cerr<<#x<<" = "<<x<<'\n'

using namespace std;
typedef long long ll;
const ll MOD = 1000000007, N = 501;

ll modpow(ll e, ll p) {
    ll r = 1;
    while(p) (p&1) && (r=r*e%MOD), e=e*e%MOD, p>>=1;
    return r;
}
int g[N][N], n, m, a, b;
int det() {
    for(int k = 0; k < n; k++) {
        int row = -1;
        for(int i = k; i < n; i++) if(g[i][k]) {
            row = i;
            break;
        }
        for(int j = 0; j < n; j++) swap(g[k][j], g[row][j]);
        for(int i = 0; i < n; i++) if(i != k) {
            ll r = (MOD-g[i][k]) * modpow(g[k][k], MOD-2) % MOD;
            for(int j = 0; j < n; j++) g[i][j] = (g[i][j] + r * g[k][j]) % MOD;
            //assert(g[i][k] == 0);
        }
    }
    //for(int i = 0; i < n; i++) for(int j = 0; j < n; j++) cout << g[i][j] << " \n"[j==n-1];
    ll res = 1;
    for(int i = 0; i < n; i++) res = res * g[i][i]%MOD;
    return res;
}
signed main() {
    ios_base::sync_with_stdio(0), cin.tie(0);
    cin >> n >> m;
    while(m--) cin >> a >> b, --a, --b, ++g[a][a], ++g[b][b], g[a][b] = g[b][a] = MOD-1;
    --n;
    //for(int i = 0; i < n; i++) for(int j = 0; j < n; j++) cout << g[i][j] << " \n"[j==n-1];
    cout << det() << '\n';
}
