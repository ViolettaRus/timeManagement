const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, color, status } = req.body;

    const project = await Project.create({
      name,
      description,
      color,
      status,
      userId: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, status } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, description, color, status },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        message: 'Проект не найден'
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        message: 'Проект не найден'
      });
    }

    res.status(200).json({
      message: 'Проект успешно удален',
      id: project._id
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};