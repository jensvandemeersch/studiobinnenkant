#!/usr/bin/env python3
"""
Studio Binnenkant — Watermerk script
=====================================
Bakt copyright als EXIF/XMP metadata in elke WebP afbeelding.
Overleeft WebP compressie volledig. Onzichtbaar voor bezoekers.
Leesbaar door rechtbanken, Getty, Adobe en reverse-image-diensten.

WAAROM METADATA EN NIET STEGANOGRAFIE:
  Lossy WebP (quality < 100) vernietigt LSB-steganografie altijd.
  EXIF/XMP metadata blijft intact bij elke kwaliteitsinstelling.
  Dit is de standaard van professionele fotografen (IPTC/XMP).

Gebruik:
  python3 watermark.py encode <map>      -- watermerk op alle WebP in map
  python3 watermark.py verify <bestand>  -- toon metadata van een bestand
  python3 watermark.py dry-run <map>     -- simuleer zonder wijzigingen

Vereisten: pip install Pillow piexif
"""

import sys
import datetime
from pathlib import Path

try:
    from PIL import Image
    import piexif
except ImportError:
    print("Installeer eerst: pip install Pillow piexif")
    sys.exit(1)

DOMAIN    = "studio-binnenkant.be"
ARTIST    = "Studio Binnenkant"
COPYRIGHT = f"Copyright {datetime.date.today().year} {ARTIST} — Alle rechten voorbehouden — {DOMAIN}"
QUALITY   = 88


def build_exif() -> bytes:
    exif_dict = {
        "0th": {
            piexif.ImageIFD.Artist:           ARTIST.encode('utf-8'),
            piexif.ImageIFD.Copyright:        COPYRIGHT.encode('utf-8'),
            piexif.ImageIFD.ImageDescription: f"Interieurontwerp door {ARTIST} — {DOMAIN}".encode('utf-8'),
            piexif.ImageIFD.Software:         b"Studio Binnenkant watermark v1.0",
            piexif.ImageIFD.DateTime:         datetime.datetime.now().strftime("%Y:%m:%d %H:%M:%S").encode(),
        },
        "Exif": {
            piexif.ExifIFD.UserComment: (
                b"ASCII\x00\x00\x00" +
                f"Copyright {datetime.date.today().year} {ARTIST} | {DOMAIN}".encode('ascii')
            ),
        },
        "GPS": {}, "1st": {}, "thumbnail": None,
    }
    return piexif.dump(exif_dict)


def get_metadata(path: Path) -> dict:
    try:
        img = Image.open(path)
        exif_bytes = img.info.get('exif', b'')
        if not exif_bytes:
            return {}
        exif = piexif.load(exif_bytes)
        result = {}
        ifd = exif.get('0th', {})
        for key, name in [
            (piexif.ImageIFD.Artist, 'artist'),
            (piexif.ImageIFD.Copyright, 'copyright'),
            (piexif.ImageIFD.ImageDescription, 'description'),
        ]:
            if key in ifd:
                result[name] = ifd[key].decode('utf-8', errors='replace')
        return result
    except Exception:
        return {}


def has_watermark(meta: dict) -> bool:
    return any(DOMAIN in v for v in meta.values())


def cmd_encode(folder: Path, dry_run: bool = False):
    files = sorted(folder.rglob('*.webp'))
    if not files:
        print(f"  Geen WebP bestanden gevonden in {folder}")
        return

    prefix = "DRY RUN  " if dry_run else ""
    print(f"\n  {prefix}Studio Binnenkant Watermerk Encoder")
    print(f"  Copyright : {COPYRIGHT}")
    print(f"  Bestanden : {len(files)}\n")

    ok = skip = err = 0
    for path in files:
        rel = path.relative_to(folder)
        try:
            if has_watermark(get_metadata(path)):
                print(f"  --  {rel}")
                skip += 1
                continue
            if not dry_run:
                img = Image.open(path)
                img.load()
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                img.save(str(path), 'WEBP', quality=QUALITY, method=6, exif=build_exif())
            print(f"  OK  {rel}")
            ok += 1
        except Exception as e:
            print(f"  !!  {rel} -> {e}")
            err += 1

    print(f"\n  Verwerkt: {ok}  |  Al klaar: {skip}  |  Fouten: {err}")
    if dry_run:
        print("  (DRY RUN: geen bestanden gewijzigd)")
    print()


def cmd_verify(path: Path):
    print(f"\n  {path.name}")
    meta = get_metadata(path)
    if not meta:
        print("  !! Geen metadata. Bestand niet gemarkeerd of metadata verwijderd.")
        print("     (Verwijdering van metadata is bewijs van manipulatie voor rechtbank.)\n")
        return
    for k, v in meta.items():
        print(f"  {k:12s}: {v}")
    status = "OK  Eigendomsbewijs aanwezig." if has_watermark(meta) else "!! Metadata aanwezig maar niet van " + DOMAIN
    print(f"\n  {status}\n")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(0)
    cmd, target = sys.argv[1], Path(sys.argv[2])
    if cmd == 'encode':
        if not target.is_dir(): print(f"Map niet gevonden: {target}"); sys.exit(1)
        cmd_encode(target)
    elif cmd == 'dry-run':
        if not target.is_dir(): print(f"Map niet gevonden: {target}"); sys.exit(1)
        cmd_encode(target, dry_run=True)
    elif cmd == 'verify':
        if not target.is_file(): print(f"Bestand niet gevonden: {target}"); sys.exit(1)
        cmd_verify(target)
    else:
        print(f"Onbekend commando: '{cmd}'\nGebruik: encode / verify / dry-run")
        sys.exit(1)

if __name__ == '__main__':
    main()
