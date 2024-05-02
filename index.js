const config = require("config")
const helmet = require("helmet")
const morgan = require("morgan")
const express = require("express")
const Joi = require("joi")
const app = express()
const logger = require("./logger")
const auth = require("./auth")

console.log(`Node Env: ${process.env.NODE_ENV}`)
console.log(`app: ${app.get("env")}`)
// built in middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
// third party middlewares
if (app.get("env") === "development") {
  app.use(morgan("tiny"))
  console.log("morgan enabled ...")
}
app.use(helmet())

// custome middleware
// app.use(logger)
// app.use(auth)

console.log(`App Name ${config.get("name")}`)
console.log(`-----------------------------`)
console.log(`App password ${config.get("mail.password")}`)

const courses = [
  { id: 1, name: "NodeJS" },
  { id: 2, name: "django" },
  { id: 3, name: "laravel" },
]

app.get("/", (req, res) => {
  res.send("Home")
})

app.get("/api/course", (req, res) => {
  res.send(courses)
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

  if (!course) return res.status(404).send(`Sorry ${rq} id was not found`)
  res.send(course)
})

app.post("/api/course", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  })

  const { error, value } = schema.validate({ name: req.body.name })

  if (error) {
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

// update request

app.put("/api/course/:id", (req, res) => {
  const course = courses.find((search) => parseInt(req.params.id) === search.id)
  if (!course) return res.status(404).send("Bad request")

  const schema = validateCourse()

  const { error, value } = schema.validate({ name: req.body.name })
  if (error) {
    // 400 bad request
    res.status(400).send(error.details[0].message)
    return
  }

  course.name = req.body.name

  res.send(course)
})

// delete

app.delete("/api/course/:id", (req, res) => {
  const course = courses.find((search) => parseInt(req.params.id) === search.id)
  if (!course) return res.status(404).send("Bad request")
  const del = courses.indexOf(course)
  courses.splice(del, 1)
  res.send(courses)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

function validateCourse() {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  })

  return schema
}
