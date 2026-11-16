const { chromium } = require('playwright'); const fs=require('fs'); const S=process.argv[2], OUT=process.argv[3];
const mark='data:image/svg+xml;base64,'+fs.readFileSync(S+'/mark.svg').toString('base64');
const head=`<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,800;1,900&display=swap" rel="stylesheet"><style>
html,body{margin:0;width:1080px;height:1920px;font-family:'Barlow Condensed',sans-serif;font-style:italic;text-transform:uppercase;color:#fff}
.full{width:1080px;height:1920px;background:radial-gradient(70% 45% at 50% 45%,rgba(31,130,208,.22),transparent 70%),#07080A;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px}
.full img{width:300px}
h1{font-weight:900;font-size:140px;line-height:.9;margin:0;text-align:center}
h1 span{color:#1F82D0}
h2{font-weight:900;font-size:92px;margin:0}
.url{font-weight:800;font-size:70px;letter-spacing:.32em;color:#1F82D0;margin-right:-.32em}
.lab{position:absolute;left:60px;display:flex;flex-direction:column;align-items:flex-start;gap:14px}
.pill{background:#1F82D0;padding:14px 34px;transform:skewX(-8deg);font-weight:900;font-size:80px;line-height:1;box-shadow:0 10px 40px rgba(0,0,0,.45)}
.pill span,.sub span{display:inline-block;transform:skewX(8deg)}
.sub{background:rgba(7,8,10,.85);padding:10px 22px;transform:skewX(-8deg);font-weight:800;font-size:34px;letter-spacing:.2em;white-space:pre}
</style>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 const shot=async(html,file,tr)=>{await p.setContent('<html><head>'+head+'</head><body style="background:'+(tr?'transparent':'#07080A')+'">'+html+'</body></html>');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.screenshot({path:OUT+'/'+file,omitBackground:!!tr});};
 await shot(`<div class="full"><img src="${mark}"><h1>One studio.<br>Every kind<br>of <span>game.</span></h1></div>`,'intro.png');
 await shot(`<div class="full"><img src="${mark}"><h2>Any game. Your brand.</h2><div class="url">gamify.com</div></div>`,'outro.png');
 for(const l of fs.readFileSync(OUT+'/items.txt','utf8').trim().split('\n')){const [id,,,,,title,sub,bottom]=l.split('|');
  await shot(`<div class="lab" style="bottom:${bottom}px"><div class="pill"><span>${title}</span></div><div class="sub"><span>${sub}</span></div></div>`,'lab-'+id+'.png',true);}
 await b.close();})();
