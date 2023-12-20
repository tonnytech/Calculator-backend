const express = require("express");

const app = express();

const cors = require('cors');

const admin = require("firebase-admin");

const credentials = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: "*",
}));


const db = admin.firestore();

app.post('/create', async (req, res) => {
    try {
        console.log(req.body);
        const userJson = {
            firstNumber: req.body.firstNumber,
            operatorSign: req.body.operatorSign,
            lastNumber: req.body.lastNumber,
            resultNumber: req.body.resultNumber
        };
        const response = await db.collection("mathData").add(userJson);
        res.send(response);
    }
    catch(error) {
        res.send(error);
    }
})

app.get('/read/all', async (req, res) => {
    try {
        const usersRef = db.collection("mathData");
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send (responseArr)
    } catch (error) {
        res.send (error);
    }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> {
    console.log(`server is running on PORT ${PORT}`);
});
