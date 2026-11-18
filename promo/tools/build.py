import subprocess, sys
S=sys.argv[1]; D=3.5; X=0.25; FPS=30
picks=[l.strip().split('|') for l in open(S+'/picks.txt') if l.strip()]
segs=[]
def run(a): subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y']+a,check=True)
# intro / outro stills
run(['-loop','1','-t','1.8','-i',S+'/intro.png','-vf',f'fps={FPS},format=yuv420p,zoompan=z=\'1+0.04*on/54\':d=1:s=1080x1920:fps={FPS}','-c:v','libx264','-crf','18',S+'/s-intro.mp4'])
run(['-loop','1','-t','2.8','-i',S+'/outro.png','-vf',f'fps={FPS},format=yuv420p','-c:v','libx264','-crf','18',S+'/s-outro.mp4'])
segs.append((S+'/s-intro.mp4',1.8))
for id,f,ss,title,dur in picks:
    D=float(dur)
    if '_small' in f: base='crop=886:1600:0:119,scale=1080:-2,crop=1080:1920'
    elif 'ScreenRecording' in f: base='crop=1080:1950:0:145,scale=1080:-2,crop=1080:1920'
    else: base='scale=1080:1920:flags=lanczos'
    out=f'{S}/s-{id}.mp4'
    run(['-ss',ss,'-t',str(D),'-i',f,'-loop','1','-t',str(D),'-i',f'{S}/lab-{id}.png','-filter_complex',
         f'[0:v]{base},fps={FPS},setsar=1[v];[1:v]format=rgba,fade=in:st=0.15:d=0.3:alpha=1[l];[v][l]overlay=0:0,format=yuv420p',
         '-an','-c:v','libx264','-crf','18',out])
    segs.append((out,D))
    D=3.5
segs.append((S+'/s-outro.mp4',2.8))
inp=[]; [inp.extend(['-i',p]) for p,_ in segs]
fc=[]; last='[0:v]'; t=segs[0][1]
for i in range(1,len(segs)):
    off=t-X; lab=f'[x{i}]'
    fc.append(f'{last}[{i}:v]xfade=transition=fade:duration={X}:offset={off:.3f}{lab}'); last=lab; t=off+segs[i][1]
fc.append(f'{last}format=yuv420p[out]')
run(inp+['-filter_complex',';'.join(fc),'-map','[out]','-c:v','libx264','-crf','23','-preset','slow','-movflags','+faststart','-r',str(FPS),S+'/gamify-sports-promo-9x16.mp4'])
print('total',round(t,2),'s')
