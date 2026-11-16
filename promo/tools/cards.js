const { chromium } = require('playwright'); const fs=require('fs'); const S=process.argv[2];
const mark='data:image/svg+xml;base64,'+fs.readFileSync(S+'/mark.svg').toString('base64');
const head=`<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,800;1,900&display=swap" rel="stylesheet"><style>
html,body{margin:0;width:1080px;height:1920px;font-family:'Barlow Condensed',sans-serif;font-style:italic;text-transform:uppercase;color:#fff}
.full{width:1080px;height:1920px;background:radial-gradient(70% 45% at 50% 45%,rgba(31,130,208,.22),transparent 70%),#07080A;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px}
.full img{width:300px}
h1{font-weight:900;font-size:150px;line-height:.88;margin:0;text-align:center}
h1 span{color:#1F82D0}
h2{font-weight:900;font-size:92px;margin:0;letter-spacing:.01em}
.url{font-weight:800;font-size:70px;letter-spacing:.32em;color:#1F82D0;margin-right:-.32em}
.lab{position:absolute;left:60px;bottom:540px;display:flex;flex-direction:column;align-items:flex-start;gap:14px}
.pill{background:#1F82D0;padding:14px 34px;transform:skewX(-8deg);font-weight:900;font-size:84px;line-height:1;box-shadow:0 10px 40px rgba(0,0,0,.45)}
.pill span{display:inline-block;transform:skewX(8deg)}
.sub{background:rgba(7,8,10,.82);padding:10px 22px;transform:skewX(-8deg);font-weight:800;font-size:34px;letter-spacing:.24em}
.sub span{display:inline-block;transform:skewX(8deg)}
.bug{position:absolute;right:50px;top:60px;width:110px;opacity:.95}
</style>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 const shot=async(html,file,transparent)=>{await p.setContent('<html><head>'+head+'</head><body style="background:'+(transparent?'transparent':'#07080A')+'">'+html+'</body></html>');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:S+'/'+file,omitBackground:!!transparent});};
 await shot(`<div class="full"><img src="${mark}"><h1>Choose<br>your <span>arena.</span></h1></div>`,'intro.png');
 await shot(`<div class="full"><img src="${mark}"><h2>Same game. Your brand.</h2><div class="url">gamify.com</div></div>`,'outro.png');
 const names=fs.readFileSync(S+'/picks.txt','utf8').trim().split('\n').map(l=>l.split('|'));
 for(const [id,,,title] of names) await shot(`<div class="lab" style="${id==='american'?'bottom:150px':''}"><div class="pill"><span>${title}</span></div><div class="sub"><span>Play it in your brand</span></div></div>`,'lab-'+id+'.png',true);
 const ok=await p.evaluate(()=>document.fonts.check('900 italic 40px "Barlow Condensed"'));console.log('font',ok);await b.close();})();
