#include <bits/stdc++.h>
#define MOD 1000000007
#define int long long
#define MAXN 500
#define pii pair<int,int>
#define ff first
#define ss second
using namespace std;

signed n, m;
signed a, b;
int p, ans = 1;
int adj[MAXN+5][MAXN+5];

int modpow(int e, int p) {
  int r = 1;
  for (int i = 1; i <= p; i <<= 1) {
    if (i & p) r = (r * e) % MOD;
    e = (e * e) %MOD;
  }
  return r;
}

int modinv(int n) {
  return modpow(n, MOD-2);
}

void Gauss() {
  for (int j = n-1; j >= 1; j--) {
    for (int i = n; i > j; i--) {
      p = (modinv(adj[i][i]) * adj[j][i]) % MOD;
      for (int k = 1; k <= n; k++) {
        adj[j][k] = adj[j][k] - adj[i][k] * p;
        adj[j][k] %= MOD;
      }
    }
  }
}

signed main() {
  ios_base::sync_with_stdio(0), cin.tie(0);
  cin >> n >> m;
  for (int i = 0; i < m; i++) {
    cin >> a >> b;
    adj[a][b] = adj[b][a] = -1;
    adj[a][a]++,adj[b][b]++;
  }
  n--;
  Gauss();
  for (int i = 1; i <= n; i++) {
    while (adj[i][i] < 0) adj[i][i] += MOD;
    ans = (ans * adj[i][i]) % MOD;
  }
  cout << (long long)ans << '\n';
}