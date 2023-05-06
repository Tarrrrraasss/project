# reagents_API
This is a node.js application that exposes CRUD operations on the Reagents database. To run the application, you will need to install express, mongoose, and body-parser npm packages. 


The application consists of four endpoints:



GET /reagents - retrieves all reagents from the database.

POST /reagents - adds a new reagent to the database.

PUT /reagents/:id - withdraws a certain quantity of reagents identified by the id from the database.

GET /reagents/stats - retrieves statistics including the total quantity of reagents added, withdrawn, and balance for the current month.


The application connects to a MongoDB database with credentials specified in the mongoose.connect function. 


To run the application, use the command node server.js assuming you save the code in the server.js file. The application starts listening on port 3000 and outputs a message in the console when it starts and when a request is made to it.
