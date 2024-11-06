
### Objectives
This project is intended as a school project for my Systems Engineering career with a cybersecurity specialty. The assignment is about two methods of encryption, [**transposition matrices**][1] and [**RSA**][2].

### Approach
The requirements for this project was to create a chat application where the messages where first encrypted and then sended, in order to create a secure communication between 2 users.

#### Task
The task was simple, encrypt the text message that a client sends using [transpose][1] of matrices, it could be *rows to columns* or *columns to rows*. And using [RSA][2] as a encryption for the rows and columns used to transpose the matrix, so both, the text message and information to decrypt the message, are secure sent.

### Solution
This project was intended to be simple, so I decided to use JavaScript as my way to solve this problem. I think was the quickest solution because it's easier to make a client-server application using web tools, and with libraries like Socket with NodeJs it was the easier solution. 

#### Front-end
So I started by writing a simple front-end using HTML and CSS, which are a simple input element and a button to login, and a chat box where the messages will show off with an input for the message and a button to send. The messages will separate from each user by positioning at the most right the sender message and at the most left the receiver message which will have the name of who sent that message in bold text.

#### Back-end
For the backend I wrote a simple server using NodeJs and Socket library for the connection between the client and the server. The client will import the socket library in order to have a succesfull communication with the server and will update the messages shown in the chat box.

#### Encryption/decryption
The most important part of this application was the encrypt/decrypt topic. So for that I created 2 main files which will contain the necesary methods to encrypt the message to send and then decrypt the message received

Starting with [transposition][1] I wanted to be modular and no matter what length was the message it will work. My approach was the following: 

1. Take the length of the message.
2. Calculate the number of rows that will be used in the matrix
3. With No. of rows calculated, calculate the number of columns
4. Write the message in a matrix with size rows*columns and read its transpose

In the second step, the number of rows is adaptable, it means that it doesn't matter the size of the message, always is gonna be a good balance between rows and columns, meaning that we will not have a matrix that is too narrow or squared. The algorithm is:
``` python
# Find the last prime number under n,
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

# Return the number of rows
def genRows(lenMsg):
    '''
    With every 100 number of characters in our text we divide
    the original length by its remainder +1, so we have a proper
    range to work.
    '''
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

```
So we first calculate the numbers of columns using the last prime under the size of the message divided by `length/100+1` and then we find a number that multiplied with the number of rows we get the length of the message +2, that +2 will ensure that we have enough space to shift the message in the matrix by 1 in order to put random characters at the begining and at the end.

For example:
```py
message = "Hello World!"
length = 12
rows = primeBelow(12/(12/100+1)) # = 11
cols = genCols(11, 12) # 2
```
With 

[1]:https://en.wikipedia.org/wiki/Transpose 'Transpose'
[2]:https://es.wikipedia.org/wiki/RSA 'RSA'



github.com/mkdevtek/chat_encrypted
