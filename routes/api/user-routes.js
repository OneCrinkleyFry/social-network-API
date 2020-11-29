const router = require('express').Router();
const { 
   getAllUsers, 
   getUserById, 
   createUser, 
   updateUser, 
   deleteUser,
   addFriend
} = require('../../controllers/user-controller');
const User = require('../../models/User');

router
   .route('/')
   .get(getAllUsers)
   .post(createUser);

router
   .route('/:id')
   .get(getUserById)
   .put(updateUser)
   .delete(deleteUser);

router
   .route('/:userId/friends/:friendId')
   .post(addFriend)

module.exports = router;