const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

const UserSchema = new Schema(
   {  
      // the username for a user
      username: {
         type: String,
         unique: true,
         required: true,
         trim: true
      },
      // the user's email
      email: {
         type: String,
         required: true,
         unique: true,
         // regex to pick out a valid email.
         match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please enter a valid email address']
      },
      // an array of thoughts 
      thoughts: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
         }
      ],
      // an array of other users
      friends: [
         {
            type: Schema.Types.ObjectId,
            ref: 'User'
         }
      ]
   },
   {
      toJSON: {
         // allows getters, and virtuals
         virtuals: true,
         getters: true
      },
      //removes the redundant id
      id: false
   }
);

// a virtual to count the number of friends
UserSchema.virtual('friendCount').get(function () {
   return this.friends.length;
});

// a middleware function that is called after a find and delete method is called.
UserSchema.post('findOneAndDelete', function(doc) {
   //assigns thoughts to the erased user document, thoughts array
   const thoughts = doc.thoughts;
   // iterates throught the thoughts array
   for (let i = 0; i < thoughts.length; i++) {
      // removes any the thought by id
      Thought.findOneAndDelete({ _id: thoughts[i] })
      .then(dbThoughtData => {
         if (!dbThoughtData) {
            return new Error('No thought with this id!')
         }
         return dbThoughtData;
      })
      .catch(err => res.json(err));
   }
});

const User = model('User', UserSchema);

module.exports = User;