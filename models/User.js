const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

const UserSchema = new Schema(
   {
      username: {
         type: String,
         unique: true,
         required: true,
         trim: true
      },
      email: {
         type: String,
         required: true,
         unique: true,
         match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please enter a valid email address']
      },
      thoughts: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
         }
      ],
      friends: [
         {
            type: Schema.Types.ObjectId,
            ref: 'User'
         }
      ]
   },
   {
      toJSON: {
         virtuals: tru,
         getters: true
     },
     id: false
   }
);

UserSchema.virtual('friendCount').get(function () {
   return this.friends.length;
});

UserSchema.pre('remove', function(next) {
   Thought.remove({ _id: this._id }).exec();
   next();
});

const User = model('User', UserSchema);

module.exports = User;