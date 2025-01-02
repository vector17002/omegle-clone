import express from "express";

const PORT = 3001
const app = express();


app.get('/', (req, res) => {
    res.send("Hello from the server")
})
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
})