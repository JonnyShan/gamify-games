import subprocess, sys
O=sys.argv[1]; X=0.25; FPS=30
IT=sys.argv[2] if len(sys.argv)>2 else O+'/items.txt'; OUTF=sys.argv[3] if len(sys.argv)>3 else O+'/gamify-all-games-promo-9x16.mp4'
items=[l.rstrip('\n').split('|') for l in open(IT) if l.strip()]
def run(a): subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y']+a,check=True)
segs=[]
run(['-loop','1','-t','2.0','-i',O+'/intro.png','-vf',f'fps={FPS},format=yuv420p','-c:v','libx264','-crf','18',O+'/s-intro.mp4']); segs.append((O+'/s-intro.mp4',2.0))
for id,kind,f,ss,d,title,sub,bottom in items:
    d=float(d); out=f'{O}/s-{id}.mp4'
    if kind=='phone': v='[0:v]crop=1080:1950:0:145,scale=1080:-2,crop=1080:1920,fps=30,setsar=1[v]'
    elif kind=='phone2': v='[0:v]crop=886:1600:0:119,scale=1080:-2,crop=1080:1920,fps=30,setsar=1[v]'
    elif kind=='full': v='[0:v]scale=1080:1920:flags=lanczos,fps=30,setsar=1[v]'
    else:
        pre='crop=ih*3/4:ih,' if kind=='land' else ''
        v=('[0:v]fps=30,split[a][b];'
           '[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.28:saturation=1.1[bg];'
           '[b]'+pre+'scale=1000:1420:force_original_aspect_ratio=decrease:flags=lanczos[fg];'
           '[bg][fg]overlay=(W-w)/2:140+(1420-h)/2,setsar=1[v]')
    run(['-ss',ss,'-t',str(d),'-i',f,'-loop','1','-t',str(d),'-i',f'{O}/lab-{id}.png','-filter_complex',
         v+';[1:v]format=rgba,fade=in:st=0.1:d=0.25:alpha=1[l];[v][l]overlay=0:0,format=yuv420p','-an','-c:v','libx264','-crf','18',out])
    segs.append((out,d))
run(['-loop','1','-t','3.0','-i',O+'/outro.png','-vf',f'fps={FPS},format=yuv420p','-c:v','libx264','-crf','18',O+'/s-outro.mp4']); segs.append((O+'/s-outro.mp4',3.0))
inp=[]; [inp.extend(['-i',p]) for p,_ in segs]
fc=[]; last='[0:v]'; t=segs[0][1]
for i in range(1,len(segs)):
    off=t-X; lab=f'[x{i}]'; fc.append(f'{last}[{i}:v]xfade=transition=fade:duration={X}:offset={off:.3f}{lab}'); last=lab; t=off+segs[i][1]
fc.append(f'{last}format=yuv420p[out]')
run(inp+['-filter_complex',';'.join(fc),'-map','[out]','-c:v','libx264','-crf','23','-preset','slow','-movflags','+faststart','-r',str(FPS),OUTF])
print('total',round(t,2))
