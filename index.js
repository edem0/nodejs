const express = require('express');
const port = 3010;

const wizards = [
  { name: "Harry", magicWand: "Wandy", house: "Gryffindor" },
  { name: "Someone", magicWand: "Magic", house: "Slytherin" },
  { name: "Noone", magicWand: "None", house: "Ravenclaw" },
];

const app = express();
app.use(express.json());

app.get('/wizards', (req, res) => {
  res.send(wizards);
});

app.get('/wizards/:id', (req, res) => {
  const wizard = wizards[req.params.id];
  if (wizard) {
    res.send(wizard);
  } else {
    res.send({});
  }
});

app.post('/wizards', (req, res) => {
  const { name, magicWand, house } = req.body;
  if (name && magicWand && house) {
    wizards.push({ name, magicWand, house });
    res.status(201).send({ name, magicWand, house });
  } else {
    res.status(400).send({ message: 'Invalid data' });
  }
});

app.put('/wizards/:id', (req, res) => {
  const wizard = wizards[req.params.id];
  if (wizard) {
    const { name, magicWand, house } = req.body;
    wizard.name = name;
    wizard.magicWand = magicWand;
    wizard.house = house;
    res.send(wizard);
  } else {
    res.status(404).send({ message: "Wizard not found" });
  }
});

app.patch('/wizards/:id', (req, res) => {
  const wizard = wizards[req.params.id];
  if (wizard) {
    const { name, magicWand, house } = req.body;
    if (name) wizard.name = name;
    if (magicWand) wizard.magicWand = magicWand;
    if (house) wizard.house = house;
    res.send(wizard);
  } else {
    res.status(404).send({ message: "Wizard not found" });
  }
});


app.delete('/wizards/:id', (req, res) => {
  const wizardIndex = req.params.id;
  if (wizards[wizardIndex]) {
    wizards.splice(wizardIndex, 1);
    res.send({ message: "Delete successful" });
  } else {
    res.status(404).send({ message: "Wizard not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});