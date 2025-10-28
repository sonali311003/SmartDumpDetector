from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

PORT = 8000

Handler = SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.js': 'application/javascript',
    '.json': 'application/json'
})

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever() 