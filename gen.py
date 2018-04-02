popSize = 64 #accounts for 4 children from each set of 2 parents
fittest = 4 #select the 4 fittest from each population

def createNewPopulation(oldPopulation):
    #breed the fittest parents until we have a full population again and run
    newPopulation = []
    fittestIndexes = getFittest(oldPopulation)
    for x in range(0, 4):
        for y in range(x+1, 4):
            newPopulation.append(breedParents(parent1, parent2, oldPopulation))

    for i in range(len(newPopulation)):
        newPopulation[i] = mutateChild(newPopulation[i])

    return newPopulation

def getFittest(population):
    #fill an array of fittest size until end of population

def breedParents(parent1Index, parent2Index, population):
    #pick a sub-section 1/4th the size of both parents and switch them

def mutateChild(child):
    #pick 1/5th of inputs and randomly change them

def getFitnessOfSpecies(species):
    fitness = species[1]