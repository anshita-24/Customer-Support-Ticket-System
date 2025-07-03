const User = require("../models/User");

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("name email");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
