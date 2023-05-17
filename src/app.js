/**
 * This is a sample microservice to demonstrate the implementation
 * of the circuit breaker pattern
 * This circuit-breaker-upstream-service provide the simple upstream API and
 * also can be simulate the failure so that the caller service must implement
 * the circuit breaker logic
 */

const express = require('express');

const app = express();
const port = process.env.PORT || 3000
let maintenance = false;

// Simple upstream API

app.get('/profiles/:id', function(req, res){
    console.log(`Get incomming request for profile id: ${req.params.id}`);
    if (maintenance){
        console.log(`simulate slow response for 4 seconds`)
        setTimeout(function() {
            console.log(`send response`);
            res.json(
                {
                    id: req.params.id,
                    firstName: 'Johh',
                    lastName: 'Doe'
                }
            )
        }, 4000);
        //res.sendStatus(500);
    } else {
        res.json(
            {
                id: req.params.id,
                firstName: 'Johh',
                lastName: 'Doe'
            }
        )
    }
})

app.post('/maintenance/off', function(req, res){
    maintenance = true;
    console.log(`Maintenance mode`);
    res.sendStatus(200);
})

app.post('/maintenance/on', function(req, res){
    maintenance = false;
    console.log(`Normal mode`);
    res.sendStatus(200);
})

const server = app.listen(port, () => {
    console.log(`Circuit Breaker Upstream is started at port ${port}`);
})

const gracefully = function(){
    console.log(`Gracefully shutting down the process...`)
    server.close();
    console.log(`Process is shutdown gracefully`)
}

// Register gracefully shutdown
process.on('SIGINT', gracefully);
process.on('SIGTERM', gracefully);
