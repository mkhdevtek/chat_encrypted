import string
import random
import timeit

def primeBelow(n):
    '''
    Gets the largest prime number
    under the parameter **n**
    '''
    primes = []
    if n < 6:
        return 3
    for i in range(2, n):
        isPrime = True
        for j in range(2, i):
            if i % j == 0:
                isPrime = False
        if isPrime:
            primes.append(i)
    return primes[-1]

def printMatrix(matrix):
    print('Matriz:','-'*15)
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            print(matrix[i][j], end = " ")
        print()
    print('-'*20)

def genRows(lenMsg):
    newlen = int(lenMsg/100+1)
    return primeBelow(lenMsg//newlen)

def genCols(mult, total):
    '''
    Returns a number that multiplied by **mult**
    is less than **total**-2
    '''
    i = 1
    while mult*i < total+2:
        i+=1
    return i

def genMatrix(rows, cols):
    matrix = []
    for x in range(rows):
        matrix.insert(x, ['']*cols)
    return matrix

def readRC(mat, textLen):
    '''
    Reads and return the message from the matrix.
    It reads like so:
      [[0,0],[0,1],[0,2],...,[1,0],[1,1],...[n,m]]
    **textLen**, is the original size of the message
    '''
    msg = ""
    for r in range(len(mat)):
        for c in range(len(mat[r])):
            msg += mat[r][c]
    return msg[1:textLen+1]

def fillMatRC(mat, text, rows, cols):
    k = 0
    for r in range(rows):
        for c in range(cols):
            if k < len(text) and mat[r][c] == '':
                mat[r][c] = text[k]
                k += 1
            elif mat[r][c]=='' and k>=len(text):
                mat[r][c] = random.choice(string.ascii_letters)

def traspRC(text, rows, cols):
    msgtrasp = ""
    mat = genMatrix(rows, cols)
    mat[0][0], mat[rows-1][cols-1] = random.choice(string.ascii_letters), random.choice(string.ascii_letters)
    fillMatRC(mat, text, rows, cols)
    printMatrix(mat)
    for r in range(cols):
        for c in range(rows):
            msgtrasp += mat[c][r]
    return msgtrasp
    
def decryptRC(text, rows, cols, originalSize):
    msgdecrypt = ""
    mat = genMatrix(cols, rows)
    k = 0
    for r in range(rows):
        for c in range(cols):
            if k < len(text) and mat[c][r] == '':
                mat[c][r] = text[k]
                k += 1
    printMatrix(mat)
    msgdecrypt = readRC(mat, originalSize)
    return msgdecrypt

msg = "Hello world!"

print("Original message:", msg)
print('-'*20)

rows = genRows(len(msg))
cols = genCols(rows, len(msg))
print(f'Tamanio del mensaje: {len(msg)}')
print(f'Tamanio de la matriz: {rows}x{cols}={rows*cols}')
print('-'*20)

msgtrasp = traspRC(msg, cols, rows)
print("Message encrypted:", msgtrasp)
print('-'*20)

msgdecrypted = decryptRC(msgtrasp, rows, cols, len(msg))
print("Message decrypted:", msgdecrypted)
