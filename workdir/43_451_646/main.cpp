#include <bits/stdc++.h>

using namespace std;

typedef long long ll;

const ll MOD = 1000000007;

ll mypow(ll a, ll b) {
    ll res = 1;
    while(b) {
        if(b & 1) res = res * a % MOD;
        a = a * a % MOD;
        b >>= 1;
    }
    return res;
}

typedef struct matrix {
    int r, c;
    vector<vector<ll>> m;
    matrix(int _r, int _c) {
        r = _r, c = _c;
        m = vector<vector<ll>>(r, vector<ll>(c));
    }
    void resize(int _r, int _c) {
        r = _r, c = _c;
        m.resize(_r);
        for(auto &row : m) {
            row.resize(_c);
        }
    }
    ll det() {
        assert(r == c);
        ll res = 1;
        for(int i = 0; i < r; i++){
            if(m[i][i] == 0) {
                for(int j = i + 1; j < r; j++) {
                    if(m[j][i]) {
                        swap(m[i], m[j]);
                        res = -res;
                        break;
                    }
                }
            }
            for(int j = i + 1; j < r; j++) {
                ll tmp = m[j][i] * mypow(m[i][i], MOD - 2) % MOD;
                for(int k = i; k < c; k++) {
                    m[j][k] -= m[i][k] * tmp % MOD;
                    if(m[j][k] < 0) m[j][k] += MOD;
                    if(m[j][k] >= MOD) m[j][k] -= MOD;
                }
            }
        }
        for(int i = 0; i < r; i++) {
            res = res * m[i][i] % MOD;
        }
        return res;
    }
} matrix;

int main() {
    int n, m;
    cin >> n >> m;
    matrix L(n, n);
    for(int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        u--, v--;
        L.m[u][u]++;
        L.m[v][v]++;
        L.m[u][v]--;
        L.m[v][u]--;
    }
    L.resize(n - 1, n - 1);
    for(vector<ll> &row : L.m)
        for(ll &num : row)
            if(num < 0)
                num += MOD;
    cout << L.det() << '\n';
    return 0;
}
