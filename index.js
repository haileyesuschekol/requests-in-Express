// const pug = require("pug")
const stDebug = require("debug")("app:startup")
const dbDebug = require("debug")("app:db")
const config = require("config")
const helmet = require("helmet")
const morgan = require("morgan")
const express = require("express")
const Joi = require("joi")
const app = express()
const logger = require("./middleware/logger")
const auth = require("./middleware/auth")
const courses = require("./routes/courses")

// pug
app.set("view engine", "pug")

console.log(`Node Env: ${process.env.NODE_ENV}`)
console.log(`app: ${app.get("env")}`)
// built in middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use("/api/course", courses)
// third party middlewares
if (app.get("env") === "development") {
  stDebug("morgan enabled ...")
  app.use(morgan("tiny"))
}

dbDebug("connect to db  . . .")

app.use(helmet())

// custome middleware
// app.use(logger)
// app.use(auth)

console.log(`App Name ${config.get("name")}`)
console.log(`-----------------------------`)
console.log(`App password ${config.get("mail.password")}`)

app.get("/", (req, res) => {
  res.render("index", { title: "renderd", message: "PugTemplet" })
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
