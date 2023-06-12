const mongoose = require('mongoose')

const num_args = process.argv.length

if (num_args != 3 && num_args != 5) {
    console.log('Inputs should be as follows:')
    console.log('node mongo.js [password] [name] [number]')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.6jvwluf.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (num_args == 3) {
    console.log("phonebook")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: name,
        number: number,
    })
    
    person.save().then(result => {
        console.log(`Added ${name}, number ${number} to the phonebook.`)
        mongoose.connection.close()
    })
}

// FYvcFpt9Z2k7CjRq