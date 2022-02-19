const express = require('express');
const app = express();
const port = 3010;
const Sequelize = require('sequelize');
const { User } = require('./models');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', async (req, res) => {
    const users = await User.findAll({
        attributes: ['lastName']
    });
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    try{
        const userID = req.params.id;
        const oneUser = await User.findByPk(userID);
        if (!oneUser) throw new Error('id not found')
        res.json(oneUser);
    }
    catch (e) {
        console.log(e);
        res.status(404).json({
            message: "User not found"
        });
    }
    
});

app.post('/users/search', async (req, res) => {
    const users = await User.findAll({
        where: {
            [Sequelize.Op.or]: [
                { 
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email
                }
            ]
        }
    });
    res.json(users);
});

app.post('/users', async (req, res) => {
    // req.body contains an Object with firstName, lastName, email
    const { firstName, lastName, email } = req.body;
    const newUser = await User.create({
        firstName,
        lastName,
        email
    });
    
    // Send back the new user's ID in the response:
    res.json({
        id: newUser.id
    });
});

app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    
    // Assuming that `req.body` is limited to
    // the keys firstName, lastName, and email
    const updatedUser = await User.update(req.body, {
      where: {
        id
      }
    });
    
    res.json(updatedUser);
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.destroy({
        where: {
            id
        }
    });
    res.json(deletedUser);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
