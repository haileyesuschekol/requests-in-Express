const express = require("express")
const Joi = require("joi")
const app = express()

app.use(express.json())

const courses = [
  { id: 1, name: "NodeJS" },
  { id: 2, name: "django" },
  { id: 3, name: "laravel" },
]

app.get("/", (req, res) => {
  res.send("Home")
})

app.get("/api/course", (req, res) => {
  res.send(JSON.stringify({ name: "node.js" }))
})
// route parameter
app.get("/api/course/:fname/:lname", (req, res) => {
  res.send(req.params.fname)
})
// query parameter
app.get("/api/course/1", (req, res) => {
  res.send(req.query)
})
//get method with specific id

app.get("/api/course/:id", (req, res) => {
  const rq = req.params.id
  console.log(rq)
  const course = courses.find((search) => search.id === parseInt(req.params.id))
  console.log(course)

  if (!course) res.status(404).send(`Sorry ${rq} id was not found`)
  res.send(course)
})

app.post("/api/course", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  })

  const { error, value } = schema.validate({ name: req.body })

  console.log(value)
  console.log(error)

  if (!error) {
    // 400 bad request
    res.status(400).send(error.details[0].message)
    return
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  }

  courses.push(course)
  res.send(courses)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
