#include <bits/stdc++.h>
using namespace std;
const int maxn = 510;
const int MOD = 1000000007;
long long a[maxn][maxn];
long long pwr(long long a, long long n)
{
  if(n == 0) return 1;
  long long ans = pwr(a,n/2);
  ans = ans * ans % MOD;
  if(n&1) return ans * a % MOD;
  return ans;
}
long long inv(long long n)
{
  return pwr(n,MOD-2);
}
int main()
{
  int n,m;
  cin >> n >> m;
  for(int i = 0; i < m; i++)
  {
    int u,v;
    cin >> u >> v;
    a[u][v] = a[v][u] = -1;
    a[u][u]++;
    a[v][v]++;
  }
  for(int i = 1; i < n; i++)
  {
    int row = i;
    for(int j = i; j < n; j++)
    {
      if(a[j][i])
      {
        row = j;
        break;
      }
    }
    for(int k = 1; k < n; k++)
      swap(a[i][k],a[row][k]);
    for(int j = i+1; j < n; j++)
    {
      long long mul = a[j][i] * inv(a[i][i]) % MOD;
      for(int k = i; k < n; k++)
      {
        a[j][k] -= a[i][k] * mul;
        a[j][k] = ((a[j][k] % MOD) + MOD) % MOD;
      }
    }
  }
  long long ans = 1;
  for(int i = 1; i < n; i++)
  {
    ans = ans * a[i][i] % MOD;
  }
  cout << ans << '\n';
  return 0;
}
