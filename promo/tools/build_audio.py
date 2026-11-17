# Builds a promo soundtrack: real game audio (or exact-length generated effects) per clip, music underneath.
import subprocess,sys,os
P='/tmp/claude-0/-home-user/66916df2-97e5-5c94-940a-436d2711a82b/scratchpad'
U='/root/.claude/uploads/66916df2-97e5-5c94-940a-436d2711a82b/'
J=U+'9b082195-ScreenRecording_11-16-2026_16-04-00_1_small.mp4'
R=U+'30a650be-ScreenRecording_11-17-2026_16-37-56_1.mov'
GEN={'racing':'sfx2/racing.mp3','starfighter':'sfx2/starfighter.mp3','uber':'sfx2/uber.mp3','matchbox':'sfx2/matchbox.mp3','prisoner':'sfx2/prisoner.mp3','debate':'sfx2/debate.mp3','jumanji':'sfx2/jumanji.mp3','jaecoo':'sfx2/jaecoo.mp3','motorbike':'audio/motorbike.mp3','intro':'sfx2/intro.mp3','outro':'sfx2/outro.mp3'}
PARTS={'jackal':[(J,43.6,1.4),(J,45.0,1.8),(J,41.0,1.6)],'rugby':[(R,0.0,5.0)]}
def run(a): subprocess.run(['ffmpeg','-nostdin','-v','error','-y']+a,check=True)
def seg(id,src,ss,d,out):
    if id in GEN:
        run(['-i',f'{P}/{GEN[id]}','-af',f'aformat=sample_rates=44100:channel_layouts=stereo,apad,atrim=0:{d},loudnorm=I=-16:TP=-1.5,afade=t=in:d=0.05,afade=t=out:st={max(0,d-0.2)}:d=0.2',out]); return
    parts=PARTS.get(id,[(src,float(ss),d)])
    ins=[];fc=''
    for i,(f,s,l) in enumerate(parts): ins+=['-ss',str(s),'-t',str(l),'-i',f]; fc+=f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo[p{i}];'
    fc+=''.join(f'[p{i}]' for i in range(len(parts)))+f'concat=n={len(parts)}:v=0:a=1,apad,atrim=0:{d},loudnorm=I=-16:TP=-1.5,afade=t=in:d=0.08,afade=t=out:st={max(0,d-0.2)}:d=0.2[a]'
    run(ins+['-filter_complex',fc,'-map','[a]',out])
def build(video,segs,intro,outro,out,music=f'{P}/audio/music2.mp3',X=0.25,mvol=0.30):
    tmp=f'{P}/audio/tmp'; os.makedirs(tmp,exist_ok=True)
    allsegs=[('intro',None,0,intro)]+segs+[('outro',None,0,outro)]
    t=0;placed=[]
    for i,(id,src,ss,d) in enumerate(allsegs):
        f=f'{tmp}/{i:02d}-{id}.wav'; seg(id,src,ss,d,f); placed.append((f,t)); t+=d-X
    total=t+X
    mdur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',music],capture_output=True,text=True).stdout)
    tempo=min(1.0,mdur/total) if total>mdur else 1.0
    ins=['-i',video,'-i',music];fc=[f'[1:a]aformat=sample_rates=44100:channel_layouts=stereo,atempo={max(0.5,tempo):.4f},atrim=0:{total:.2f},loudnorm=I=-16,volume={mvol},afade=t=out:st={total-1.5:.2f}:d=1.5[m]']
    labs=[]
    for k,(f,st) in enumerate(placed):
        ins+=['-i',f]; ms=int(st*1000); fc.append(f'[{k+2}:a]adelay={ms}|{ms}[s{k}]'); labs.append(f'[s{k}]')
    fc.append('[m]'+''.join(labs)+f'amix=inputs={len(labs)+1}:normalize=0:duration=first,alimiter=limit=0.9[a]')
    run(ins+['-filter_complex',';'.join(fc),'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',out])
    print(out,'total',round(total,2))
if __name__=='__main__':
    which=sys.argv[1]
    if which in('mix','all'):
        L=[l.split('|') for l in open(f'{P}/promo/all/'+('items-mix.txt' if which=='mix' else 'items.txt')).read().split('\n') if l.strip()]
        segs=[(x[0],x[2],x[3],float(x[4])) for x in L]
        v=f'{P}/promo/all/gamify-'+('mixed' if which=='mix' else 'all-games')+'-promo-9x16.mp4'
        build(v,segs,2.0,3.0,v.replace('-9x16.mp4','-9x16-sound.mp4'))
    else:
        L=[l.split('|') for l in open(f'{P}/promo/picks.txt').read().split('\n') if l.strip()]
        segs=[(x[0],x[1],x[2],float(x[4])) for x in L]
        v=f'{P}/promo/gamify-sports-promo-9x16.mp4'
        build(v,segs,1.8,2.8,v.replace('-9x16.mp4','-9x16-sound.mp4'))
