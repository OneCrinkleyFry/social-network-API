const router = require('express').Router();
const { 
   getAllThoughts,
   getThoughtById,
   createThought,
   deleteThought
} = require('../../controllers/thought-controller');

router
   .route('/')
   .get(getAllThoughts)
   .post(createThought)

router
   .route('/:id')
   .get(getThoughtById)
   .delete(deleteThought)

module.exports = router;