const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getTimeEntries,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry
} = require('../controllers/timeEntriesController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTimeEntries)
  .post(createTimeEntry);

router.route('/:id')
  .put(updateTimeEntry)
  .delete(deleteTimeEntry);

module.exports = router;