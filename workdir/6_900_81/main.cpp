#pragma gcc optimize("O3")
#include "bits/stdc++.h"
using namespace std;
typedef int64_t lld;
#define ff first
#define ss second
#define pb push_back
#define all(x) (x).begin(),(x).end()
#define endl '\n'
#define jizz cin.tie(0);cout.tie(0);ios::sync_with_stdio(0);

const int modd = 1e9+7;
inline int pos(lld x){
    x%=modd;
    return x<0?x+=modd:x;
}
int gcd(int x,int y){
    return y?gcd(y,x%y):x;
}
int invmod(int x,int mod = modd, int s0 = 1, int s1 = 0){
    return mod?invmod(mod,x%mod,s1,s0-s1*(x/mod)):s0;
}
vector<vector<int>> Lag;
signed main(){jizz
    int n,m;
    cin >> n >> m;
    Lag.resize(n);
    for(auto& v:Lag)v.resize(n);
    while(m--){
        int a,b;
        cin >> a >> b;
        a--; b--;
        Lag[a][b]--; Lag[b][a]--;
        Lag[a][a]++; Lag[b][b]++;
    }
    Lag.pop_back();
    for(auto& v: Lag)v.pop_back();
    lld ansdiv = 1,ansmul = 1;
    n--;
    for(int i = 0; i < n; i++){
        int j = i;
        while(!Lag[j][i])j++;
        if(i!=j)
            for(int k = 0; k < n; k++)swap(Lag[i][k],Lag[j][k]);
        for(int j = i+1; j<n; j++){
            if(!Lag[j][i])continue;
            Lag[i][i] = pos(Lag[i][i]), Lag[j][i] = pos(Lag[j][i]);
            int l = gcd(Lag[i][i], Lag[j][i]);
            int a = -Lag[i][i]/l, b = Lag[j][i]/l;
            ansdiv = ansdiv*a%modd;
            for(int k = 0; k < n; k++)
                Lag[j][k] = ((lld)Lag[j][k]*a+(lld)Lag[i][k]*b)%modd;
        }
    }
    //cout << Lag << endl;
    for(int i = 0; i < n; i++)
        ansmul = ansmul*Lag[i][i]%modd;
    //cout << ansmul << endl << ansdiv << endl;
    cout << pos(ansmul*invmod(pos(ansdiv))) << endl;
}