console.log('hello Web 36!');

const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json())
// fake DB
let userDatabase = [
    {id: shortid.generate(), name: 'Jane Doe', bio: "Not Tarzans wife, another Jane"}
]

// helper functions to interact with the data
const User = {
    createNew(user) {
        const newUser = { id: shortid.generate(), ...user }
        userDatabase.push(newUser)
        return newUser
    },
    getUsers() {
        return userDatabase
    },
    getById(id) {
        return userDatabase.find(user => user.id === id)
    },
    delete(id) {
        const user = userDatabase.find(user => user.id === id)
        if (user) {
            userDatabase = userDatabase.filter(item => item.id !== id)
        }
        return user
    },
    update(id, changes) {
        const user = userDatabase.find(user => user.id === id)
        if (!user) {
            return null
        } else {
            const updatedUser = { id, ...changes }
            userDatabase = userDatabase.map(user => {
                if (user.id === id) return updatedUser
                return user
            })
            return updatedUser
        }
    }
    
}

//endpoint to get users
server.get('/api/users', (req, res) => {
    const users = User.getUsers()
    res.status(200).json(users)
})
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = User.getById(id)
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ message: 'user not found with id ' + id })
    }
})
server.post('/api/users', (req, res) => {
    const userFromClient = req.body

    if (!userFromClient.name || !userFromClient.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user." })
    } else {
        const newlyCreatedUser = User.createNew(userFromClient)
        res.status(201).json(newlyCreatedUser)
    }
})
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    const deleted = User.delete(id)

    if (deleted) {
        res.status(200).json(deleted)
    } else {
        res.status(404).json({ message: 'User not found with id ' + id})
    }
})
server.put('/api/users/:id', (req, res) => {
    const changes = req.body
    const { id } = req.params
    const updatedUser = User.update(id, changes)

    if (updatedUser) {
        res.status(200).json(updatedUser)
    } else {
        res.status(404).json({ message: 'User not found with id ' + id })
    }
})




// catch-all endpoint must be at the bottom. Order is important
server.use('*', (req, res) => {
    res.status(404).json({ message: 'not found' })
})

//start the server
server.listen(5000, () => {
    console.log('listening on port 5000');
})

