const TimeEntry = require('../models/TimeEntry');

exports.getTimeEntries = async (req, res) => {
  try {
    const { startDate, endDate, projectId } = req.query;
    let filter = { userId: req.user.id };

    if (projectId) {
      filter.projectId = projectId;
    }

    if (startDate && endDate) {
      filter.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const timeEntries = await TimeEntry.find(filter)
      .populate('projectId', 'name color')
      .sort({ startTime: -1 });

    res.status(200).json(timeEntries);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.createTimeEntry = async (req, res) => {
  try {
    const { projectId, startTime, endTime, duration, pausedDuration, description } = req.body;

    const timeEntry = await TimeEntry.create({
      projectId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration,
      pausedDuration,
      description,
      userId: req.user.id
    });

    await timeEntry.populate('projectId', 'name color');

    res.status(201).json(timeEntry);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateTimeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId, startTime, endTime, duration, pausedDuration, description } = req.body;

    const timeEntry = await TimeEntry.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        projectId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        pausedDuration,
        description
      },
      { new: true, runValidators: true }
    ).populate('projectId', 'name color');

    if (!timeEntry) {
      return res.status(404).json({
        message: 'Запись времени не найдена'
      });
    }

    res.status(200).json(timeEntry);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.deleteTimeEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const timeEntry = await TimeEntry.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!timeEntry) {
      return res.status(404).json({
        message: 'Запись времени не найдена'
      });
    }

    res.status(200).json({
      message: 'Запись времени успешно удалена',
      id: timeEntry._id
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};