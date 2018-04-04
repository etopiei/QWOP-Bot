import random

def createNewPopulation(oldPopulation):
    #breed the fittest parents until we have a full population again and run
    newPopulation = []
    fittestIndexes = getFittest(oldPopulation)

    #log data about parents to be bred to file
    parents = []
    for x in range(len(fittestIndexes)):
        parents.append(oldPopulation[fittestIndexes[x]])

    with open("population.txt", "a") as myFile:
        myFile.write(str(parents)+"\n")

    for x in range(0, 4):
        for y in range(x+1, 4):
            parent1 = fittestIndexes[x]
            parent2 = fittestIndexes[y]
            children = breedParents(parent1, parent2, oldPopulation)
            for child in children:
                newPopulation.append(child)

    for i in range(len(newPopulation)):
        newPopulation[i] = mutateChild(newPopulation[i])

    with open("population.txt", "a") as myFile:
        myFile.write(str(newPopulation)+"\n")

    return list(newPopulation)

def getMin(myList):
    mini = myList[0][0]
    miniIndex = 0
    for x in range(1, len(myList)):
        if myList[x][0] < mini:
            mini = myList[x][0]
            miniIndex = x

    return mini, miniIndex

def getFittest(population):
    fittest = []
    #fill a list of 4 fittest until end of population
    for x in range(len(population)):
        fitness = getFitnessOfSpecies(population[x])
        if len(fittest) < 4:
            fittest.append([fitness, x])
        else:
            score, index = getMin(fittest)
            if score < fitness:
                #remove the min and put new fitness in
                del fittest[index]
                fittest.append([fitness, x])

    #return index of 4 fittest parents
    returnList = []
    for x in range(len(fittest)):
        returnList.append(fittest[x][1])

    return returnList

def breedParents(parent1Index, parent2Index, population):
    #breed 6 children
    children = []

    #pick a random sub-section 1/5th the size of both parents and switch them to create a child
    shortestParent = min(len(population[parent1Index][0]), len(population[parent2Index][0]))
    substringLength = shortestParent//5

    for _ in range(3):
        startSplit = random.randrange(0, shortestParent-substringLength)
        newChildString1 = population[parent2Index][0][:startSplit] + population[parent1Index][0][startSplit:startSplit+substringLength] + population[parent2Index][0][startSplit+substringLength:] 
        newChildString2 = population[parent1Index][0][:startSplit] + population[parent2Index][0][startSplit:startSplit+substringLength] + population[parent1Index][0][startSplit+substringLength:]
        children.append(newChildString1) 
        children.append(newChildString2)

    return children

def mutateChild(child):
    #pick random inputs and change them
    temp = list(child)

    for _ in range(random.randrange(0, len(child)//6)):
        place = random.randrange(len(child))
        temp[place] = str(random.randrange(0, 16))

    return "".join(temp)

def getFitnessOfSpecies(species):
    fitness = float(species[1])/float(species[2])
    return fitness