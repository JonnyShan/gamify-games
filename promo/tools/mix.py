import subprocess,sys
P='/tmp/claude-0/-home-user/66916df2-97e5-5c94-940a-436d2711a82b/scratchpad'
music=sys.argv[1]; out=sys.argv[2]
items=[l.split('|') for l in open(P+'/promo/all/items-mix.txt').read().split('\n') if l.strip()]
X=0.25; t=2.0-X; starts={'intro':0.0}
for it in items:
    starts[it[0]]=t; t+=float(it[4])-X
starts['outro']=t; total=t+3.0
off={'intro':[0.0],'football':[0.3],'starfighter':[0.6],'racing':[1.1,2.3],'american':[0.6],'uber':[0.3],'cricket':[0.1],'jackal':[0.9],'motorbike':[0.1],'matchbox':[0.3],'basketball':[0.6],'prisoner':[0.3],'rugby':[0.5,2.6],'tennis':[0.2],'debate':[0.6],'golf':[1.0],'outro':[0.2]}
vid=P+'/promo/all/gamify-mixed-promo-9x16.mp4'
args=['ffmpeg','-nostdin','-v','error','-y','-i',vid,'-i',music]; fc=[]; labs=[]; n=2
for k,os_ in off.items():
    for o in os_:
        args+=['-i',f'{P}/audio/{k}.mp3']; ms=int((starts[k]+o)*1000)
        fc.append(f'[{n}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=1.6,adelay={ms}|{ms}[s{n}]'); labs.append(f'[s{n}]'); n+=1
fc.append(f'[1:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{total:.2f},volume=0.5,afade=t=out:st={total-1.2:.2f}:d=1.2[m]')
fc.append('[m]'+''.join(labs)+f'amix=inputs={len(labs)+1}:normalize=0:duration=first,alimiter=limit=0.9[a]')
args+=['-filter_complex',';'.join(fc),'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',out]
subprocess.run(args,check=True); print('total',round(total,2))
