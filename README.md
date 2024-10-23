## Message Encryption
In this project, I tried a simple approach to encrypting and decrypting data using [transposition matrices][1] and a simple version of [RSA][2], which I wrote and based on Wikipedia's information and using NodeJs as my server/client connection.

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





[1]:https://en.wikipedia.org/wiki/Transpose 'Transpose'
[2]:https://es.wikipedia.org/wiki/RSA 'RSA'
