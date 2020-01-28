#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int MOD = 1e9 + 7;
const int N = 505;
ll inv(ll a)
{
    ll r = 1, b = MOD - 2;
    for (;b;b>>=1,a=a*a%MOD)
        if (b&1)
            r = r * a % MOD;
    return r;
}
array<ll, N> L[N];
int main()
{
    ios::sync_with_stdio(0);
    cin.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; ++i) {
        int a, b;
        cin >> a >> b;
        --a, --b;
        ++L[a][a];
        ++L[b][b];
        --L[a][b];
        --L[b][a];
    }
    --n;
    ll ans = 1;
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j)
            if (L[j][i]) {
                swap(L[i], L[j]);
                ans = -ans;
                break;
            }
        assert(L[i][i]);
        ans = ans * L[i][i] % MOD;
        ll a = inv(L[i][i]);
        for (int j = 0; j < n; ++j)
            L[i][j] = L[i][j] * a % MOD;
        for (int j = 0; j < n; ++j)
            if (j != i && L[j][i]) {
                a = L[j][i];
                for (int k = 0; k < n; ++k)
                    (L[j][k] += -a * L[i][k]) %= MOD;
            }
    }
    ans = (ans % MOD + MOD) % MOD;
    cout << ans << endl;
}
