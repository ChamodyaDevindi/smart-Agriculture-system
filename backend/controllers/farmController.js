const dbHelper = require('../config/dbHelper');

// @desc    Create or update farm details
// @route   POST /api/farm
// @access  Private
const createOrUpdateFarm = async (req, res) => {
  try {
    const { crop, soilType, area, location } = req.body;

    if (!crop || !soilType || !area) {
      return res.status(400).json({ success: false, message: 'Please provide crop, soilType, and area' });
    }

    // Check if farm already exists for this user using dbHelper
    let farm = await dbHelper.findOne('Farm', { userId: req.user._id });

    if (farm) {
      // Update existing farm using findOneAndUpdate
      const updatedFarm = await dbHelper.findOneAndUpdate(
        'Farm',
        { userId: req.user._id },
        { crop, soilType, area, location: location || farm.location }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Farm details updated successfully',
        data: updatedFarm,
      });
    }

    // Create new farm details using dbHelper
    farm = await dbHelper.create('Farm', {
      userId: req.user._id,
      crop,
      soilType,
      area,
      location: location || '',
    });

    res.status(201).json({
      success: true,
      message: 'Farm details created successfully',
      data: farm,
    });
  } catch (error) {
    console.error('Create Farm Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error saving farm details' });
  }
};

// @desc    Get farm details
// @route   GET /api/farm
// @access  Private
const getFarmDetails = async (req, res) => {
  try {
    const farm = await dbHelper.findOne('Farm', { userId: req.user._id });

    if (!farm) {
      return res.status(404).json({ success: false, message: 'No farm details found for this user' });
    }

    res.json({
      success: true,
      data: farm,
    });
  } catch (error) {
    console.error('Get Farm Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching farm details' });
  }
};

module.exports = {
  createOrUpdateFarm,
  getFarmDetails,
};
