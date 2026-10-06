#!/usr/bin/env python3
"""Mirror Sid's project repos into sid/<name>/.

A public, non-fork, non-archived repo of github.com/siddharthajbiswas opts in
by setting its GitHub "homepage" to https://biswas.net/sid/<name>/ (www. is
fine too). Its files come from the branch `biswas-pages` when that branch
exists (for projects that need a build step), otherwise from the repo's
default branch, and replace sid/<name>/ exactly, minus the top-level README,
git and editor files.

Only sid/<name>/ folders of opted-in repos are ever written. Everything else
in this site, including the rest of sid/, is never touched.
"""
from __future__ import annotations

import io
import json
import os
import re
import shutil
import sys
import tarfile
import urllib.error
import urllib.request

OWNER = "siddharthajbiswas"
DEST_ROOT = "sid"
HOME_RE = re.compile(r"^https?://(?:www\.)?biswas\.net/sid/([a-z0-9][a-z0-9_-]{0,63})/?$")
SKIP_TOP_FILES = {"README.md", "README", ".gitignore", ".gitattributes", ".DS_Store"}
SKIP_DIRS = {".git", ".github", ".idea", ".vscode"}
MAX_BYTES = 300 * 1024 * 1024
TOKEN = os.environ.get("GITHUB_TOKEN")


def api(url: str, raw: bool = False):
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json", "User-Agent": "sync-sid"})
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=300) as resp:
        body = resp.read()
    return body if raw else json.loads(body)


def owner_repos() -> list[dict]:
    out, page = [], 1
    while True:
        batch = api(f"https://api.github.com/users/{OWNER}/repos?type=owner&per_page=100&page={page}")
        if not batch:
            return out
        out += batch
        page += 1


def has_branch(repo: str, branch: str) -> bool:
    try:
        api(f"https://api.github.com/repos/{OWNER}/{repo}/branches/{branch}")
        return True
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return False
        raise


def mirror(repo: str, ref: str, dest: str) -> None:
    blob = api(f"https://api.github.com/repos/{OWNER}/{repo}/tarball/{ref}", raw=True)
    tmp = dest + ".sync-tmp"
    shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(tmp)
    total = 0
    with tarfile.open(fileobj=io.BytesIO(blob), mode="r:gz") as tf:
        for m in tf.getmembers():
            parts = [p for p in m.name.split("/")[1:] if p]   # drop <owner>-<repo>-<sha>/
            if not parts or ".." in parts or m.issym() or m.islnk():
                continue
            if any(p in SKIP_DIRS for p in parts):
                continue
            if len(parts) == 1 and m.isfile() and parts[0] in SKIP_TOP_FILES:
                continue
            target = os.path.join(tmp, *parts)
            if m.isdir():
                os.makedirs(target, exist_ok=True)
                continue
            if not m.isfile():
                continue
            total += m.size
            if total > MAX_BYTES:
                raise RuntimeError(f"{repo}@{ref} is larger than {MAX_BYTES} bytes")
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with tf.extractfile(m) as src, open(target, "wb") as fh:
                shutil.copyfileobj(src, fh)
    shutil.rmtree(dest, ignore_errors=True)
    os.replace(tmp, dest)


def main() -> int:
    seen: dict[str, str] = {}
    for r in sorted(owner_repos(), key=lambda r: r["name"]):
        if r.get("fork") or r.get("archived") or r.get("private"):
            continue
        m = HOME_RE.match((r.get("homepage") or "").strip())
        if not m:
            continue
        name = m.group(1)
        if name in seen:
            print(f"error: {r['name']} and {seen[name]} both claim sid/{name}/", file=sys.stderr)
            return 1
        seen[name] = r["name"]
        ref = "biswas-pages" if has_branch(r["name"], "biswas-pages") else r["default_branch"]
        mirror(r["name"], ref, os.path.join(DEST_ROOT, name))
        print(f"{r['name']}@{ref} -> {DEST_ROOT}/{name}/")
    if not seen:
        print("No opted-in repos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
