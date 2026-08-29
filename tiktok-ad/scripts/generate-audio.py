"""Regenerate the WAV sound effects used by the Remotion render.

These sounds mirror the oscillator settings from src/App.tsx.
Run from the project root: python scripts/generate-audio.py
"""
from pathlib import Path
import wave, math, struct

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'audio'
OUT.mkdir(parents=True, exist_ok=True)
SR = 48000

def synth(name, oscs, tail=0.03):
    total = max(delay + dur for _, _, _, dur, delay, _ in oscs) + tail
    n = int(math.ceil(total * SR))
    buf = [0.0] * n
    for f0, typ, vol, dur, delay, fend in oscs:
        start = int(delay * SR)
        length = max(1, int(dur * SR))
        for j in range(length):
            t = j / SR
            x = j / max(1, length - 1)
            if fend is None:
                phase = 2 * math.pi * f0 * t
            else:
                k = (fend - f0) / dur
                phase = 2 * math.pi * (f0 * t + 0.5 * k * t * t)
            s = math.sin(phase)
            env = vol * ((0.001 / max(vol, 1e-6)) ** x) if vol > 0 else 0
            idx = start + j
            if idx < n:
                buf[idx] += s * env
    peak = max(max(abs(v) for v in buf), 1e-9)
    scale = 0.96 / peak if peak > 0.96 else 1.0
    with wave.open(str(OUT / name), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        frames = bytearray()
        for v in buf:
            q = max(-32767, min(32767, int(v * scale * 32767)))
            frames += struct.pack('<h', q)
        w.writeframes(frames)

synth('whoosh.wav', [(180,'sine',0.06,0.30,0,700),(360,'sine',0.03,0.22,0.06,950)])
for i,f in enumerate([261,294,330,392,440,523],1):
    synth(f'pop-{i}.wav', [(f,'sine',0.09,0.08,0,None),(f*1.5,'sine',0.04,0.06,0.01,None)])
synth('impact.wav', [(80,'sine',0.24,0.15,0,35),(1600,'sine',0.08,0.30,0.02,700),(2400,'sine',0.04,0.20,0.05,1000)])
synth('word-reveal.wav', [(523,'sine',0.07,0.28,0,None),(659,'sine',0.05,0.28,0.04,None)])
scale=[261,294,330,349,392,440,494,523]
for i in range(11):
    f=scale[i%len(scale)]
    synth(f'letter-tap-{i+1}.wav', [(f,'sine',0.11,0.11,0,None),(f*2,'sine',0.04,0.07,0.02,None),(f*3,'sine',0.02,0.05,0.03,None)])
os=[]
for i,hz in enumerate([523,659,784,1047]):
    os += [(hz,'sine',0.14,0.38,i*0.12,None),(hz*1.5,'sine',0.05,0.28,i*0.12+0.06,None)]
synth('success.wav', os)
synth('reward-coin.wav', [(988,'sine',0.13,0.06,0,None),(1319,'sine',0.15,0.14,0.07,None)])
synth('pangrama.wav', [(hz,'sine',0.07-i*0.007,0.22,i*0.055,None) for i,hz in enumerate([700,900,1100,1300,1550,1850,2200])])
synth('challenge.wav', [(hz,'sine',0.10,0.24,i*0.11,None) for i,hz in enumerate([440,370,294])])
os=[(140,'sine',0.07,0.30,0,520),(65,'sine',0.28,0.13,0.28,28),(110,'sine',0.12,0.10,0.28,40)]
os += [(hz,'sine',0.09,0.40,0.33+i*0.06,None) for i,hz in enumerate([392,523,659,784])]
os += [(2000,'sine',0.05,0.22,0.36,800)]
synth('cta.wav', os)
print(f'Generated {len(list(OUT.glob("*.wav")))} WAV files in {OUT}')
