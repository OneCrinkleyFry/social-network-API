const { User, Thought } = require('../models');
const { db } = require('../models/User');

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
      Thought.create(body)
         .then(({ _id }) => {
            console.log(_id);
            return User.findOneAndUpdate(
               { _id: body.userId },
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
   },
   //update thought
   updateThought({ params, body }, res) {
      Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
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
   // remove thought
   deleteThought({ params }, res) {
      Thought.findOneAndDelete({ _id: params.id })
         .then(deletedThought => {
            if (!deletedThought) {
               return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findByIdAndUpdate(
               { username: deletedThought.username },
               { $pull: { thoughts: params.id } },
               { new: true }
            );
         })
         .then(dbUserData => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user with this id!' });
               return;
            }
            res.json(dbUserData);
         })
         .catch(err => res.json(err));
   },
   // Add a reaction
   addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
         { _id: params.thoughtId },
         { $push: { reactions: body } },
         { new: true, runValidators: true }
      )
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
   // Removes a reaction
   deleteReaction({ params }, res) {
      Thought.findOneAndUpdate(
         { _id: params.thoughtId },
         { $pull: { reactions: { reactionId: params.reactionId } } },
         { new: true }
      )
         .then(dbThoughtData => res.json(dbThoughtData))
         .catch(err => res.json(err));
   }
};

module.exports = thoughtController;