#!/usr/bin/env python3
"""Validate local href/src targets in static HTML; external URLs are skipped."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import sys
ROOT = Path.cwd()
class RefParser(HTMLParser):
    def __init__(self, file):
        super().__init__(); self.file=file; self.refs=[]
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ("href", "src") and value:
                self.refs.append(value.strip())
errors=[]; checked=0
for html in sorted(ROOT.glob("*.html")):
    parser=RefParser(html); parser.feed(html.read_text(encoding="utf-8", errors="replace"))
    for ref in parser.refs:
        if ref.startswith(("#", "//", "http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
            continue
        path=unquote(urlparse(ref).path)
        if not path: continue
        target=(html.parent / path).resolve()
        checked += 1
        if not target.exists(): errors.append(f"{html}: missing local reference {ref}")
if errors:
    print("\n".join(errors)); sys.exit(1)
print(f"Internal link validation passed: {checked} local references checked.")
