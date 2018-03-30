import tornado.web
import tornado.websocket
import tornado.ioloop

class WebSocketHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print("Client Connected")
        self.write_message("Connected to server")

    def on_message(self, message):
        #got message from js
        print(message)

    def on_close(self):
        print("Client disconnect.")

    def check_origin(self, origin):
        # Allow cross-origin WebSocket connections
        return True

if __name__ == "__main__":

    application = tornado.web.Application([
        (r"/", WebSocketHandler),
    ])

    application.listen(8099)
    tornado.ioloop.IOLoop.instance().start()