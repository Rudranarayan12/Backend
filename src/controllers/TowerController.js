import Tower from "../models/TowerModel.js";

export const registerTower = async (req, res) => {
  try {
    const { towerNumber, location } = req.body;

    if (!towerNumber || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide tower number and location",
      });
    }

    if (typeof towerNumber !== "number") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid tower number",
      });
    }

    if (
      typeof location !== "object" ||
      location.type !== "Point" ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      typeof location.coordinates[0] !== "number" ||
      typeof location.coordinates[1] !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid location with type 'Point' and coordinates [longitude, latitude]",
      });
    }

    const existingTower = await Tower.findOne({ towerNumber });
    if (existingTower) {
      return res.status(400).json({
        success: false,
        message: "Tower number already exists",
      });
    }

    const newTower = await Tower.create({ towerNumber, location });

    return res.status(201).json({
      success: true,
      message: "Tower created successfully",
      data: newTower,
    });
  } catch (error) {
    console.error("Error in registerTower:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while registering the tower",
    });
  }
};
