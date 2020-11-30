const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

// sub document
const ReactionSchema = new Schema(
   {
      // creates new id on initialization of a reaction
      reactionId: {
         type: Schema.Types.ObjectId,
         default: () => new Types.ObjectId()
      },
      // The actual text
      reactionBody: {
         type: String,
         required: true,
         // limits charaters to 280
         max: 280
      },
      // The username of the creator
      username: {
         type: String,
         required: true
      },
      // timestamp
      createdAt: {
         type: Date,
         default: Date.now,
         get: (createdAtVal) => {
            // formats the date
            return moment(createdAtVal).format('M/D h:m a');
         }
      }
   }
)

//Thought Model
const ThoughtSchema = new Schema(
   {
      // The text of the thought
      thoughtText: {
         type: String,
         required: true,
         // limits characters between 1, and 280
         min: 1,
         max: 280
      },
      // timestamp
      createdAt: {
         type: Date,
         default: Date.now,
         get: (createdAtVal) => {
            // formats the date
            return moment(createdAtVal).format('M/D h:m a');
         }
      },
      // username of the creator
      username: {
         type: String,
         required: true
      },
      // an array containing reactions that follow the reaction sub document
      reactions: [ReactionSchema]
   },
   {
      toJSON: {
         // allows getters and the use of virtuals
         getters: true,
         virtuals: true
      },
      // does not create a redundant id
      id: false
   }
);

// a virtual to count the total reactions in the thoughts reactions array
ThoughtSchema.virtual('reactionCount').get(function() {
   return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;