#pragma gcc optimize("O2")
#include<iostream>
#include<unordered_map>
#include<utility>
#include<chrono>
#include<map>
using namespace std;
typedef int64_t lld;
#define ff first
#define ss second
#define mp make_pair
#define jizz cin.tie(0);cout.tie(0);ios::sync_with_stdio(0);
// code starts here
typedef pair<int,int> pii;
struct chash {
    static uint64_t splitmix64(uint64_t x) {
        // http://xorshift.di.unimi.it/splitmix64.c
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }
    inline lld operator()(pii x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64((((lld)x.ff<<31)^x.ss) + FIXED_RANDOM);
    }
}mhash;

unordered_map<lld, map<pii, int>> ht;
const int MAXN = 1500;
pair<int,int> P[MAXN+1]={};
inline int gcd(int u, int v){
    if (!u||!v) return u|v;
    int shift = __builtin_ctz(u | v);
    u >>= __builtin_ctz(u);
    do {
        v >>= __builtin_ctz(v);
        if (u > v) {
            unsigned int t = v;
            v = u;
            u = t;
        }
        v = v - u;
    } while (v != 0);
    return u << shift;
}
#define abs(x) (x ^ (x >> 31)) - (x >> 31)
inline pii cancel(int a, int b){
    if(!a) return {0, 1};
    if(!b) return {1, 0};
    int g = gcd(abs(a), abs(b));
    if(a<0)g = -g;
    return {a/g, b/g};
}
inline pii reverse(pii p){ return p.ss<=0?mp(-p.ss, p.ff):mp(p.ss, -p.ff); }

signed main(){jizz;
    ht.reserve(32768);ht.max_load_factor(0.3);
    int n, ans = 0;
    cin >> n;
    for(int i = 0; i < n; ++i) cin >> P[i].ff >> P[i].ss;
    for(int i = 0; i < n; ++i)
        for(int j = 0; j < i; ++j)
            ht[mhash({P[i].ff+P[j].ff, P[i].ss+P[j].ss})][cancel(P[i].ff-P[j].ff, P[i].ss-P[j].ss)]++;
    for(auto& hti: ht)
        for(auto j: hti.ss)
            if(hti.ss.find(reverse(j.ff))!=hti.ss.end())
                ans += hti.ss[reverse(j.ff)]*j.ss;//, cout << i << ht[{i.ff.ff, reverse(i.ff.ss)}] << endl;
    cout << ans/2 << endl;
}
