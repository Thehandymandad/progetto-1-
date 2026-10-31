"""Scarica metadati, trascrizione e fotogrammi di un video YouTube.

Uso: python tools/yt_analyze.py <URL_o_ID> <cartella_output>
Ogni fase e' indipendente: se una fallisce, le altre continuano e l'errore
viene scritto in log.txt.
"""
import glob
import json
import os
import re
import subprocess
import sys
import traceback

URL = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
LOG = open(os.path.join(OUT, "log.txt"), "a", encoding="utf-8")
VID = re.search(r"(?:v=|youtu\.be/|^)([A-Za-z0-9_-]{11})", URL).group(1)
WATCH = f"https://www.youtube.com/watch?v={VID}"
CLIENTS = ["default", "tv,web_safari", "mweb", "android", "ios", "web_embedded"]


def log(msg):
    print(msg, flush=True)
    LOG.write(msg + "\n")
    LOG.flush()


def run(cmd):
    log("$ " + " ".join(cmd))
    p = subprocess.run(cmd, capture_output=True, text=True)
    log((p.stdout or "")[-3000:] + (p.stderr or "")[-3000:])
    return p.returncode == 0


def ytdlp(extra, client):
    args = ["yt-dlp", "--no-warnings", "--retries", "3"]
    if client != "default":
        args += ["--extractor-args", f"youtube:player_client={client}"]
    return run(args + extra + [WATCH])


def step(name):
    def deco(fn):
        def wrapper():
            log(f"\n===== {name} =====")
            try:
                return fn()
            except Exception:
                log(traceback.format_exc())
                return False
        return wrapper
    return deco


def vtt_to_text(path):
    """Converte VTT in righe '[mm:ss] testo' senza duplicati (auto-sub)."""
    lines, last, ts = [], None, "00:00"
    for raw in open(path, encoding="utf-8"):
        raw = raw.strip()
        m = re.match(r"(\d+):(\d\d):(\d\d)\.\d+ -->", raw) or re.match(r"(\d\d):(\d\d)\.\d+ -->", raw)
        if m:
            g = m.groups()
            if len(g) == 3:
                ts = f"{int(g[0]) * 60 + int(g[1]):02d}:{g[2]}"
            else:
                ts = f"{g[0]}:{g[1]}"
            continue
        if not raw or raw.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")) or raw.isdigit():
            continue
        txt = re.sub(r"<[^>]+>", "", raw).strip()
        if txt and txt != last:
            lines.append(f"[{ts}] {txt}")
            last = txt
    return "\n".join(lines)


@step("metadati")
def metadata():
    for c in CLIENTS:
        if ytdlp(["--skip-download", "--write-info-json", "-o", os.path.join(OUT, "video")], c):
            info = json.load(open(os.path.join(OUT, "video.info.json"), encoding="utf-8"))
            keep = {k: info.get(k) for k in ["title", "channel", "uploader", "upload_date", "duration",
                                             "view_count", "description", "chapters", "tags", "language"]}
            json.dump(keep, open(os.path.join(OUT, "metadata.json"), "w", encoding="utf-8"),
                      ensure_ascii=False, indent=2)
            os.remove(os.path.join(OUT, "video.info.json"))
            return True
    return False


@step("sottotitoli yt-dlp")
def subs():
    for c in CLIENTS:
        ytdlp(["--skip-download", "--write-subs", "--write-auto-subs", "--sub-langs", "en.*,it.*,en,it",
               "--sub-format", "vtt", "-o", os.path.join(OUT, "subs")], c)
        files = sorted(glob.glob(os.path.join(OUT, "subs*.vtt")))
        if files:
            # preferisci sottotitoli manuali/originali inglesi
            best = next((f for f in files if ".en." in f and "orig" in f), None) or \
                next((f for f in files if ".en" in f), files[0])
            open(os.path.join(OUT, "transcript.txt"), "w", encoding="utf-8").write(vtt_to_text(best))
            for f in files:
                os.remove(f)
            return True
    return False


@step("trascrizione youtube-transcript-api")
def transcript_api():
    if os.path.exists(os.path.join(OUT, "transcript.txt")):
        log("gia' presente, salto")
        return True
    from youtube_transcript_api import YouTubeTranscriptApi
    api = YouTubeTranscriptApi()
    t = api.fetch(VID, languages=["en", "it"])
    lines = [f"[{int(s.start) // 60:02d}:{int(s.start) % 60:02d}] {s.text}" for s in t]
    open(os.path.join(OUT, "transcript.txt"), "w", encoding="utf-8").write("\n".join(lines))
    return True


@step("download video (bassa risoluzione)")
def download():
    for c in CLIENTS:
        if ytdlp(["-f", "bv*[height<=480]+ba/b[height<=480]/b", "--merge-output-format", "mp4",
                  "-o", "/tmp/src.%(ext)s"], c) and glob.glob("/tmp/src.*"):
            return True
    return False


@step("trascrizione whisper (fallback)")
def whisper():
    if os.path.exists(os.path.join(OUT, "transcript.txt")):
        log("gia' presente, salto")
        return True
    src = glob.glob("/tmp/src.*")
    if not src:
        log("nessun video scaricato")
        return False
    from faster_whisper import WhisperModel
    model = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(src[0], vad_filter=True)
    lines = [f"[{int(s.start) // 60:02d}:{int(s.start) % 60:02d}] {s.text.strip()}" for s in segs]
    open(os.path.join(OUT, "transcript.txt"), "w", encoding="utf-8").write("\n".join(lines))
    return True


@step("fotogrammi e contact sheet")
def frames():
    src = glob.glob("/tmp/src.*")
    if not src:
        log("nessun video scaricato")
        return False
    fdir = "/tmp/frames"
    os.makedirs(fdir, exist_ok=True)
    every = 5
    run(["ffmpeg", "-loglevel", "error", "-i", src[0], "-vf", f"fps=1/{every},scale=480:-2",
         "-q:v", "4", os.path.join(fdir, "f_%05d.jpg")])
    from PIL import Image, ImageDraw
    files = sorted(glob.glob(os.path.join(fdir, "*.jpg")))
    sdir = os.path.join(OUT, "sheets")
    os.makedirs(sdir, exist_ok=True)
    cols, rows = 4, 3
    per = cols * rows
    for i in range(0, len(files), per):
        chunk = files[i:i + per]
        w, h = Image.open(chunk[0]).size
        sheet = Image.new("RGB", (cols * w, rows * h), "black")
        d = ImageDraw.Draw(sheet)
        for j, f in enumerate(chunk):
            x, y = (j % cols) * w, (j // cols) * h
            sheet.paste(Image.open(f), (x, y))
            t = (i + j) * every
            label = f"{t // 60:02d}:{t % 60:02d}"
            d.rectangle([x, y, x + 62, y + 18], fill="black")
            d.text((x + 4, y + 3), label, fill="yellow")
        t0 = i * every
        sheet.save(os.path.join(sdir, f"sheet_{t0 // 60:02d}m{t0 % 60:02d}s.jpg"), quality=70)
    log(f"{len(files)} fotogrammi, {len(glob.glob(os.path.join(sdir, '*.jpg')))} sheet")
    return True


if __name__ == "__main__":
    results = {}
    for fn in [metadata, subs, transcript_api, download, whisper, frames]:
        results[fn.__name__] = bool(fn())
    log("\nRISULTATI: " + json.dumps(results))
    json.dump(results, open(os.path.join(OUT, "status.json"), "w"), indent=2)
