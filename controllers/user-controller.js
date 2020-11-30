const { User } = require('../models');

const userController = {
   // get all users
   getAllUsers(req, res) {
      // finds all users
      User.find({})
         // "joins" the collections
         .populate({
            //at thoughts
            path: 'thoughts',
            select: 'thoughtText createdAt reactions reactionCount'
         })
         .populate({
            // at friends
            path: 'friends',
            // doesn't display __v
            select: '-__v'
         })
         // doesn't display __v
         .select('-__v')
         // sorts by newest
         .sort({ _id: -1 })
         .then(dbUserData => res.json(dbUserData))
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   },
   //get a single user by _id
   getUserById({ params }, res) {
      User.findOne({ _id: params.id })
         // "joins" the collections
         .populate({
            //at thoughts
            path: 'thoughts',
            // doesn't display __v
            select: '-__v'
         })
         .populate({
            // at friends
            path: 'friends',
            // doesn't display __v
            select: '-__v'
         })
         // doesn't display __v
         .select('-__v')
         .then(dbUserData => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id!' });
               return;
            }

            res.json(dbUserData)
         })
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   },
   //create a user
   createUser({ body }, res) {
      User.create(body)
         .then(dbUserData => res.json(dbUserData))
         .catch(err => res.status(400).json(err));
   },
   //update a user
   updateUser({ params, body }, res) {
      // finds a user by id, and then updates the field in the body
      User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
         .then(dbUserData => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id!' });
               return;
            }
            res.json(dbUserData);
         })
         .catch(err => res.status(400).json(err));
   },
   //delete a user
   deleteUser({ params }, res) {
      // finds a user by id, and removes it from the document
      User.findByIdAndDelete(params.id)
         .then(dbUserData => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id!' });
               return;
            }
            res.json(dbUserData);
         })
         .catch(err => res.json(err));
   },
   // add a friend
   addFriend({ params }, res) {
      //finds the user 
      User.findOneAndUpdate(
         { _id: params.userId },
         // and adds a reference to another user
         { $push: { friends: params.friendId } },
         { new: true }
      )
         .then(dbUserData => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id!' });
               return;
            }
            res.json(dbUserData);
         })
         .catch(err => res.json(err));
   },
   // remove friend
   removeFriend({ params }, res) {
      //finds the user
      User.findOneAndUpdate(
         { _id: params.userId },
         //and pulls the reference to another user out of the friends array
         { $pull: { friends: params.friendId } },
         { new: true }
      )
         .then(dbUserData => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id!' });
               return;
            }
            res.json(dbUserData);
         })
         .catch(err => res.json(err));
   }
}

module.exports = userController;