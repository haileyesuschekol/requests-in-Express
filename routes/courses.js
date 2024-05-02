const express = require("express")
const router = express.Router()

const courses = [
  { id: 1, name: "NodeJS" },
  { id: 2, name: "django" },
  { id: 3, name: "laravel" },
]

router.get("/", (req, res) => {
  res.send(courses)
})
// route parameter
router.get("/:fname/:lname", (req, res) => {
  res.send(req.params.fname)
})
// query parameter
router.get("/1", (req, res) => {
  res.send(req.query)
})

//get method with specific id
router.get("/:id", (req, res) => {
  const rq = req.params.id
  console.log(rq)
  const course = courses.find((search) => search.id === parseInt(req.params.id))
  console.log(course)

  if (!course) return res.status(404).send(`Sorry ${rq} id was not found`)
  res.send(course)
})

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const course = courses.find((search) => parseInt(req.params.id) === search.id)
  if (!course) return res.status(404).send("Bad request")
  const del = courses.indexOf(course)
  courses.splice(del, 1)
  res.send(courses)
})

module.exports = router
