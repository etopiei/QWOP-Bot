import tornado.web
import tornado.websocket
import tornado.ioloop
import random
import gen

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

def checkNewGenAndUpdate():
    global speciesNumber
    if (speciesNumber+1)%64 == 0:
        #need to generate a new generation
        population = gen.createNewPopulation(outData)
        global generationNumber
        generationNumber += 1
        speciesNumber = 0
    else:
        #update species number
        speciesNumber += 1

def nextAction(step):
    if len(population) >= speciesNumber:
        #get the action from the population data
        return population[[speciesNumber][0][step%len(population[speciesNumber][0])]]
    else:
        #generate a random action
        return inputOptions[random.randrange(0, 4)]

def deal_with_message(msg):
    #extract data from message
    if msg != "newData":
        #go to next species and record data from last species
        parts = msg.split(',')
        score = parts[0]
        time = parts[1]
        speciesFinalData = [speciesOut, score, time]
        outData.append(speciesFinalData)
        speciesOut = []
        #reset step
        global step
        step = 0
        checkNewGenAndUpdate()
    else:
        #get next action
        global step
        speciesOut.append(nextAction(step))
        step += 1

if __name__ == "__main__":

    inputOptions = ["q", "w", "o", "p", ""]

    generationNumber = 0
    speciesNumber = 0

    speciesOut = []
    step = 0

    population = []
    outData = []

    application = tornado.web.Application([
        (r"/", WebSocketHandler),
    ])

    application.listen(8099)
    tornado.ioloop.IOLoop.instance().start()