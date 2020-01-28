#pragma gcc optimize("O3")

#include<iostream>
#include<bitset>
using namespace std;
typedef int64_t lld;
const int MAXN = 10000000+1, MAXP = 78498+1, mod = 998244353, pmod = mod-1;
static int primes[MAXP], ts = -1, smui[MAXN], mu[MAXN], expo[MAXN];
bitset<MAXN> isnPrime;

template<typename T> inline void cent(T& a){ if(a>pmod) a-=pmod; if(a<0)a+=pmod; }
inline int norms(int a){ return a<0?a+pmod:a; }

[[gnu::pure]] inline lld S(lld x){ return x*(x+1)/2; }

[[gnu::pure]] int fpow(int a, int b){
    lld ans = 1;
    do if(b&1) ans = ans*a%mod;
    while(a=(lld)a*a%mod, b>>=1);
    return ans;
}

signed main(){
    smui[0] = mu[0] = 0, smui[1] = mu[1] = 1;
    int N, M;
    cin >> N >> M;
    if(N<M)swap(N, M);
    for(int i = 2; i <= N; i++){
        if(!isnPrime[i]){
            primes[++ts] = i;
            smui[i] = 1-i, mu[i] = -1;
        }
        for(int j = 0, p = primes[j]; j <= ts; j++, p = primes[j]){
            if((lld)p*i>N)break;
            isnPrime[i*p] = true;
            if(i%p==0){
                smui[i*p] = smui[i], mu[i*p] = 0;
                break;
            }
            mu[i*p] = -mu[i], smui[i*p] = smui[i]*(1-p);
        }
    }
    for(int i = 1, j = 1; i <= N; j=++i) {
        mu[i] = (mu[i-1]+(lld)mu[i]*i*i)%pmod;
        int Mi = S(M/i)*smui[i]%pmod, MNi = (S(N/i)*smui[i]+Mi)%pmod;
        for(; j <= M; j+= i) cent(expo[j] += MNi);
        for(; j <= N; j+= i) cent(expo[j] +=  Mi);
    }
    lld ans = 1;
    for(int i = 1, nexti = 0, val; i <= N; i++){
        if(i > nexti){
            if(i < M){
                nexti = min(N/(N/i), M/(M/i));
                int n = N/nexti, m = M/nexti; val = 0;
                for(int j = 1; j <= m; j++){
                    int prej = j-1;
                    j = min(n/(n/j), m/(m/j));
                    cent(val += S(n/j)%pmod*(S(m/j)%pmod)%pmod*(mu[j]-mu[prej])%pmod);
                }
            } else nexti = INT_MAX, val = 0;
        }
        (ans *= fpow(i, (lld)i*norms(expo[i]-val)%pmod))%=mod;
    }
    cout << ans << endl;
}
