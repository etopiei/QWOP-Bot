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
    global speciesNumber, population
    if (speciesNumber+1)%64 == 0:
        #need to generate a new generation
        population = gen.createNewPopulation(outData)
        global generationNumber
        generationNumber += 1
        speciesNumber = 0
    else:
        #update species number
        speciesNumber += 1

def nextAction(step, population):
    if len(population) >= speciesNumber and len(population) > 0:
        #get the action from the population data
        return str(population[speciesNumber][step%len(population[speciesNumber])])
    else:
        #generate a random action
        return str(inputOptions[random.randrange(0, 5)])

def deal_with_message(msg):
    global step, speciesOut, generationNumber, speciesNumber
    #extract data from message
    if msg != "newData":
        #go to next species and record data from last species
        parts = msg.split(',')
        score = parts[0]
        time = parts[1]

        #log data
        print(str(generationNumber), "," , str(speciesNumber), "," , score)
        with open("data.txt", "a") as myFile:
            myFile.write(str(speciesOut)+"\n")

        speciesFinalData = [speciesOut, score, time]
        outData.append(speciesFinalData)
        speciesOut = []
        #reset step
        step = 0
        checkNewGenAndUpdate()
        return " " #start new species going
    else:
        #get next action
        action = nextAction(step, population)
        speciesOut.append(action)
        step += 1
        return action

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