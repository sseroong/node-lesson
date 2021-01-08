const express = require('express');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('./middlewares');

const User = require('../models/user');
const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id/unfollow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      console.log(user.Following);
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('언팔에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/edit', isLoggedIn, async (req, res, next) => {
  try {
    const { nick, password } = req.body;
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      const hash = await bcrypt.hash(password, 12);
      user.update({
        nick: nick,
        password: hash
      });

      return res.redirect('/profile');
    } else {
      res.status(404).send('정보를 업데이트 할 수 없습니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
