const express = require("express")
const app = express()

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

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
