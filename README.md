# QWOP-Bot

This is a bot to play QWOP, written with web sockets and python.

## Example

![Example Video]("qwop-example.gif")

## Details

To get this working I scraped foddy.net and grabbed the HTML5 QWOP, I then removed restrictions to make it run locally.
Next I set up a web socket between the browser and a python server.

Now I had two way transfer between the game and python So I could begin sending inputs to the game and recieving output from the variables in the game.

## More Detailed Instructions

It's a little complicated to run this, as I don't own the rights to QWOP. However I can give a general guide as to how to set this up:

First you need to download the required assets from foddy.net to load the game through the Athletics.html folder in this repo. The code there should give you a clue what assets are required.

The next step is to edit QWOP(2).min.js to not have restrictions on domain. The code checks if it is running on foddy.net and doesn't if it isn't, so you have to remove this restriction.

Next you have to add three functions to the game code to connect to the runner on the page:

    Add a qwopLoaded() method call when the game starts.
    Add a sendGameStats() method to the update method that fires every frame
    Add a sendEndGameStats(score, time) call to the end game method.

Now the JS is all set up to run QWOP via websockets. Sp you can host a webserver (using python or PHP) and load the file 'Athletics.html' in your browser.

The final step is setting up the python script which will connect to the browser via web-sockets and give commands to the athlete.

To do this:

$ pip install tornado
$ python3 qwop-send.py

Now it should connect to the client in the browser to play QWOP. Update the code in gen.py and qwop-send.py to control how the bot plays.

