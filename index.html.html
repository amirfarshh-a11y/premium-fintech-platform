<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>قیمت لحظه‌ای به تومان</title>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{min-height:100vh;font-family:Vazirmatn,Tahoma,sans-serif;color:#ecebf3;background:radial-gradient(1100px 600px at 80% -10%,#1d1838 0%,transparent 60%),radial-gradient(900px 500px at 0% 110%,#0f2a33 0%,transparent 60%),#0a0a12;padding:72px 20px 40px;position:relative}
.maker,.cc{position:absolute;top:20px;left:20px;font-size:12px;font-weight:400;letter-spacing:.3px;padding:7px 16px;border-radius:99px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#fff}
.cc{left:auto;right:20px;font-family:Tahoma,sans-serif;font-weight:600;letter-spacing:2px;direction:ltr}
main{max-width:940px;margin:0 auto}
header{text-align:center;margin-bottom:44px}
.eyebrow{font-size:11px;letter-spacing:3px;color:#c9a96a;font-weight:600}
h1{font-size:34px;font-weight:800;margin:10px 0 14px;letter-spacing:-.5px}
.sub{display:inline-flex;align-items:center;gap:9px;font-size:12.5px;color:#a8a6bd;padding:6px 16px;border:1px solid rgba(255,255,255,.1);border-radius:99px}
.dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;animation:pulse 2s infinite}
.dot.err{background:#f87171;box-shadow:0 0 10px #f87171;animation:none}
@keyframes pulse{50%{opacity:.35}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:18px}
.card{--c:#fff;position:relative;padding:22px 22px 16px;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.09);overflow:hidden;opacity:0;transform:translateY(14px);animation:in .6s forwards;transition:border-color .3s,transform .3s}
.card:hover{border-color:var(--c);transform:translateY(-4px)}
.card::after{content:"";position:absolute;inset:auto -30% -60% -30%;height:70%;background:radial-gradient(closest-side,var(--c),transparent);opacity:.1;transition:opacity .3s}
.card:hover::after{opacity:.22}
@keyframes in{to{opacity:1;transform:none}}
.top{display:flex;align-items:center;gap:13px}
.ic{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:18px;font-weight:600;color:var(--c);border:1px solid var(--c);background:rgba(255,255,255,.03);font-family:Tahoma,sans-serif}
.name{font-weight:600;font-size:15px}
.en{font-size:10.5px;color:#8f8da6;letter-spacing:1.5px;direction:ltr;text-align:right;margin-top:2px}
.price{font-size:31px;font-weight:800;margin:22px 0 4px;font-variant-numeric:tabular-nums;transition:color .4s}
.price.up{color:#4ade80}.price.down{color:#fb7185}
.unit{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#8f8da6}
.chg{font-weight:600;direction:ltr}
svg.sp{width:100%;height:40px;margin-top:12px;display:block}
.note{margin-top:34px;font-size:11.5px;color:#7f7d96;line-height:2;text-align:center;max-width:640px;margin-inline:auto}
@media(max-width:520px){h1{font-size:27px}.price{font-size:27px}}
</style>
</head>
<body>
<div class="maker">سازنده: امیرحسین</div>
<div class="cc">IR</div>
<main>
<header>
 <div class="eyebrow">LIVE MARKET</div>
 <h1>قیمت لحظه‌ای به تومان</h1>
 <div class="sub"><span class="dot" id="st"></span><span id="time">در حال بارگذاری…</span></div>
</header>
<div class="grid" id="grid"></div>
<p class="note">دلار و تتر بر پایه‌ی نرخ تتر در نوبیتکس هستند. پوند از نرخ جهانی و طلا از اونس جهانی محاسبه می‌شود و شامل اجرت و حباب بازار داخلی نیست. این اعداد راهنما هستند، نه توصیه‌ی مالی.</p>
</main>
<script>
const items=[
 {k:'usd',n:'دلار آمریکا',e:'USD',i:'$',c:'#4ade80',u:'تومان'},
 {k:'usdt',n:'تتر',e:'USDT',i:'₮',c:'#2dd4bf',u:'تومان'},
 {k:'gbp',n:'پوند انگلیس',e:'GBP',i:'£',c:'#a78bfa',u:'تومان'},
 {k:'btc',n:'بیتکوین',e:'BTC',i:'₿',c:'#fbbf24',u:'تومان'},
 {k:'gold18',n:'طلای ۱۸ عیار (هر گرم)',e:'GOLD 18K',i:'Au',c:'#e6c36a',u:'تومان'},
 {k:'ounce',n:'اونس جهانی طلا',e:'XAU / OZ',i:'Oz',c:'#fb923c',u:'دلار'}
];
const hist={},first={};
const grid=document.getElementById('grid');
grid.innerHTML=items.map((x,n)=>`<div class="card" style="--c:${x.c};animation-delay:${n*80}ms"><div class="top"><div class="ic">${x.i}</div><div><div class="name">${x.n}</div><div class="en">${x.e}</div></div></div><div class="price" id="p-${x.k}">—</div><div class="unit"><span>${x.u}</span><span class="chg" id="c-${x.k}"></span></div><svg class="sp" id="s-${x.k}" viewBox="0 0 100 30" preserveAspectRatio="none"></svg></div>`).join('');
const fmt=n=>Math.round(n).toLocaleString('fa-IR');
async function j(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(r.status);return r.json()}
function spark(k,c){
  const h=hist[k];if(h.length<2)return;
  const mn=Math.min(...h),mx=Math.max(...h),r=(mx-mn)||1;
  const pts=h.map((v,i)=>`${(i/(h.length-1))*100},${27-((v-mn)/r)*24}`).join(' ');
  document.getElementById('s-'+k).innerHTML=`<polyline points="${pts}" fill="none" stroke="${c}" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>`;
}
function show(k,v){
  if(v==null||!isFinite(v))return;
  const el=document.getElementById('p-'+k),it=items.find(x=>x.k===k);
  const h=hist[k]=hist[k]||[];
  const last=h[h.length-1];
  el.textContent=fmt(v);
  if(last!=null&&v!==last)el.className='price '+(v>last?'up':'down');
  h.push(v);if(h.length>60)h.shift();
  if(first[k]==null)first[k]=v;
  const p=(v-first[k])/first[k]*100,ch=document.getElementById('c-'+k);
  ch.textContent=(p>=0?'▲ ':'▼ ')+Math.abs(p).toFixed(2)+'٪';
  ch.style.color=p>=0?'#4ade80':'#fb7185';
  spark(k,it.c);
}
async function update(){
  const [nb,bn,fx]=await Promise.allSettled([
    j('https://api.nobitex.ir/market/stats?srcCurrency=usdt,btc&dstCurrency=rls'),
    j('https://api.binance.com/api/v3/ticker/price?symbols=%5B%22PAXGUSDT%22%5D'),
    j('https://open.er-api.com/v6/latest/USD')
  ]);
  let usdt=null;
  if(nb.status==='fulfilled'){
    const s=nb.value.stats||{};
    if(s['usdt-rls']){usdt=parseFloat(s['usdt-rls'].latest)/10;show('usdt',usdt);show('usd',usdt)}
    if(s['btc-rls'])show('btc',parseFloat(s['btc-rls'].latest)/10);
  }
  if(usdt&&fx.status==='fulfilled'&&fx.value.rates&&fx.value.rates.GBP)show('gbp',usdt/fx.value.rates.GBP);
  if(bn.status==='fulfilled'&&bn.value[0]){
    const oz=parseFloat(bn.value[0].price);
    show('ounce',oz);
    if(usdt)show('gold18',oz/31.1035*0.75*usdt);
  }
  const ok=nb.status==='fulfilled';
  document.getElementById('st').className='dot'+(ok?'':' err');
  document.getElementById('time').textContent=ok?('زنده · '+new Date().toLocaleTimeString('fa-IR')):'خطا در دریافت قیمت‌ها؛ تلاش مجدد…';
}
update();setInterval(update,15000);
</script>
</body>
</html>
