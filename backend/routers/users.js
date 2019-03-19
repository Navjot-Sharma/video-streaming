const router = require('express')();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const prod = require('../prod/prod');
const checkAuth = require('../middlewares/auth');

router.get('', async (req, res) => {
  try {
    const users = await User.find();
    if(!users) throw new Error('No user found');

    res.status(200).json(users);
  } catch(err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log(req.body.password);
    const result = await User.findOne({email: req.body.email});
    if (!result) throw new Error(`User id or password didn't match`);

    const isMatched = await bcrypt.compare(req.body.password, result.password);
    if (!isMatched) throw new Error(`User id or password didn't match`);
//try Delete Here Today delete Result.password
    const user = {
      _id: result._id,
      name: result.name,
      email: result.email,
      authId: result.authId
    }
    const token = jwt.sign(user, prod.jwt, {
      expiresIn: '72h'
    });

    res.status(200).json({user, token});
  } catch(err) {
    console.log(err.message);
    res.status(404).json(err.message);
  }
});

router.post('/signup', async (req, res) => {
  try {
    console.log('signup', req.body);
    const hash = await bcrypt.hash(req.body.password, 10);
    if (!hash) throw new Error('Server error');

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    const result = await newUser.save();

    const user = {
      _id: result._id,
      name: result.name,
      email: result.email,
      authId: result.authId
    }

    const token = jwt.sign(user, prod.jwt, {
      expiresIn: '72h'
    });

    res.status(200).json({user, token});
  } catch(error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!req.body.password) throw new Error('Please enter a password');

    let user = await User.findById(req.params.id);
    if (!user) throw new Error(`User id or password didn't match`);

    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) throw new Error(`User id or password didn't match`);

    const updates = {
      email: req.body.email,
      name: req.body.name,
    };
    console.log('updates', updates);

    result = await User.findByIdAndUpdate(req.params.id, {$set: updates}, {new: true});

    user = {
      _id: result._id,
      name: result.name,
      email: result.email,
      authId: result.authId
    }

    console.log('user', user);
    const token = jwt.sign(user, prod.jwt, {expiresIn: '72h'});
    res.status(200).json({user, token});
  } catch(error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');

    res.status(200).json(user);
  } catch(err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});


module.exports = router;
