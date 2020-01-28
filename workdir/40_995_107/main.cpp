#include <bits/stdc++.h>
using namespace std;
#define int long long
#define maxn 510

const int mod = 1000000007;
struct GAUSS{
    int n;
    vector<vector<int>> v;
    int ppow(int a , int k){
        if(k == 0) return 1;
        if(k % 2 == 0) return ppow(a * a % mod , k >> 1);
        if(k % 2 == 1) return ppow(a * a % mod , k >> 1) * a % mod;
    }
    int solve(){
        int det = 1;
        vector<int> ans(n);
        for (int now = 0; now < n; ++ now) {
            for (int i = now; i < n; ++ i)
                if(v[now][now] == 0 && v[i][now] != 0)
                    swap(v[i] , v[now]);
            if(v[now][now] == 0) return 0;
            int inv = ppow(v[now][now] , mod - 2);
            for (int i = 0; i < n; ++ i) if(i != now){
                int tmp = v[i][now] * inv % mod;
                for (int j = now; j < n; ++ j)
                    (v[i][j] += mod - tmp * v[now][j] % mod) %= mod;
            }
        }
        for (int i = 0; i < n; ++ i)
            det = det * v[i][i] % mod;
        return det;
    }
} gs;

int n, m, x[maxn][maxn];
int32_t main() {
    cin.tie(0), cout.sync_with_stdio(0);

    cin >> n >> m;
    for (int i = 1; i <= m; ++ i) {
        int v1, v2;
        cin >> v1 >> v2;
        v1 --, v2 --;
        x[v1][v1] ++;
        x[v2][v2] ++;
        x[v1][v2] --;
        x[v2][v1] --;
    }
    n --;
    gs.n = n;
    gs.v.resize(n  , vector<int>(n , 0));
    for (int i = 0; i < n; ++ i) {
        for (int j = 0; j < n; ++ j) {
            gs.v[i][j] = (x[i][j] % mod + mod) % mod;
        }
    }
    cout << gs.solve() << endl;
    return 0;
}
