const { User, Thought } = require('../models');

const thoughtController = {
   // Get all thoughts
   getAllThoughts(req, res) {
      Thought.find({})
         .select('-__v')
         .sort({ _id: -1 })
         .then(dbThoughtData => res.json(dbThoughtData))
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   },
   // Get thought by _id
   getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.id })
         .select('-__v')
         .then(dbThoughtData => {
            if (!dbThoughtData) {
               res.status(404).json({ message: 'No thought found with this id!' });
               return;
            }

            res.json(dbThoughtData)
         })
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   },
   // Create Thought
   createThought({ body }, res) {
      console.log(body);
      Thought.create(body)
         .then(({ _id }) => {
            console.log( _id );
            return User.findOneAndUpdate(
               { username: body.username },
               { $push: { thoughts: _id } },
               { new: true }
            );
         })
         .then(dbUserData => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id!' });
               return;
            }
            res.json(dbUserData);
         })
         .catch(err => res.json(err));
   }
};

module.exports = thoughtController;