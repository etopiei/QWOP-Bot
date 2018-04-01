import tornado.web
import tornado.websocket
import tornado.ioloop
import random

class WebSocketHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print("Client Connected")
        self.write_message(str(generationNumber) + "," + str(speciesNumber))

    def on_message(self, message):
        #got message from js
        action = deal_with_message(message)
        self.write_message(action)

    def on_close(self):
        print("Client disconnect.")

    def check_origin(self, origin):
        # Allow cross-origin WebSocket connections
        return True

def toggleRandomAction():
    return inputOptions[random.randrange(0,4)]

def deal_with_message(msg):
    #extract data from message
    if msg != "newData":
        print("New Species")
        global speciesNumber
        speciesNumber += 1
        return " "
    return toggleRandomAction()

if __name__ == "__main__":

    inputOptions = ["q", "w", "o", "p", ""]
    generationNumber = 0
    speciesNumber = 0

    application = tornado.web.Application([
        (r"/", WebSocketHandler),
    ])

    application.listen(8099)
    tornado.ioloop.IOLoop.instance().start()