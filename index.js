const express = require('express')
const cors = require('cors')
const app = express()

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = () => {
    min = Math.ceil(5);
    max = Math.floor(100000);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if(!body.name) {
        return res.status(400).json({"error":"name missing"})
    } else if(!body.number) {
        return res.status(400).json({"error": "phone number missing"})
    } 

    const found = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
    if(found) {
        return res.status(400).json({"error": "name already in phonebook"})
    }
    
    const person = {
        "id": generateID(),
        "name": body.name,
        "number": body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const pb_info = `Phonebook has info for ${persons.length} people`
    const time = String(new Date())
    
    res.send(pb_info + "<br>" + time)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({"error": "unknown endpoint"})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})