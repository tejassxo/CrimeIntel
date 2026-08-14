import http.server
import socketserver
import os

PORT = 8080

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    for port in [8080, 8085, 8090]:
        try:
            with ReusableTCPServer(("", port), Handler) as httpd:
                print(f"Cyber Jagruti Portal running at http://localhost:{port}")
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    run_server()
