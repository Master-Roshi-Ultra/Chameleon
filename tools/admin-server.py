"""Chameleon сайт болон admin panel-ийг local дээр турших сервер.

Ажиллуулах:  python tools/admin-server.py
Нээх:        http://127.0.0.1:8000/sites/chameleon-landing/dist/admin/

Admin нь энэ серверийг таньж, GitHub-ын оронд таны компьютер дээрх файлд хадгална.
"""
import base64
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# Windows консол кирилл үсгийг хэвлэж чаддаг байх.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
SITE = (ROOT / "sites" / "chameleon-landing" / "dist").resolve()
API = "/__admin/contents/"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


def site_file(repo_path):
    """Repo доторх замыг шалгаад зөвхөн сайтын хавтас доторх файлыг зөвшөөрнө."""
    target = (ROOT / repo_path).resolve()
    if SITE not in target.parents:
        raise PermissionError(repo_path)
    return target


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def repo_path(self):
        return self.path[len(API):].split("?")[0]

    def do_GET(self):
        if self.path == "/__admin/ping":
            return self.send_json(200, {"local": True})
        if self.path.startswith(API):
            try:
                file = site_file(self.repo_path())
                content = base64.b64encode(file.read_bytes()).decode()
                return self.send_json(200, {"content": content, "sha": "local"})
            except PermissionError:
                return self.send_json(403, {"message": "Сайтын хавтаснаас гадуур"})
            except FileNotFoundError:
                return self.send_json(404, {"message": "Файл олдсонгүй"})
        return super().do_GET()

    def do_PUT(self):
        if not self.path.startswith(API):
            return self.send_json(404, {"message": "Not found"})
        try:
            file = site_file(self.repo_path())
            body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_bytes(base64.b64decode(body["content"]))
            print("Хадгалав:", file.relative_to(ROOT))
            return self.send_json(200, {"content": {"sha": "local"}})
        except PermissionError:
            return self.send_json(403, {"message": "Сайтын хавтаснаас гадуур"})


if __name__ == "__main__":
    os.chdir(ROOT)
    url = f"http://127.0.0.1:{PORT}/sites/chameleon-landing/dist/"
    print("Сайт:  ", url)
    print("Admin: ", url + "admin/")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
