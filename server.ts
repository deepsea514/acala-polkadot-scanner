import express from 'express';
import basicAuth from 'express-basic-auth';

const app = express();
app.use(basicAuth({
    users: { 'acala': 'acala' },
    challenge: true,
}))
app.use(express.static("build"));
app.get("/*", (req, res) => {
    res.sendFile("build/index.html")
});

app.listen(3000, () => console.log(`Server listening on port ${3000}!`));
