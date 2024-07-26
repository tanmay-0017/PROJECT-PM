import SalesManager from "../Models/salesManager.js";

// Create a new Sales Manager
export const createSalesManager = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const salesManager = new SalesManager({ name, email, phone });
    await salesManager.save();
    res.status(201).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Sales Managers
export const getSalesManagers = async (req, res) => {
  try {
    const salesManagers = await SalesManager.find();
    res.status(200).json(salesManagers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Sales Manager by ID
export const getSalesManagerById = async (req, res) => {
  try {
    const salesManager = await SalesManager.findById(req.params.id);
    if (!salesManager)
      return res.status(404).json({ message: "Sales Manager not found" });
    res.status(200).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Sales Manager
export const updateSalesManager = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const salesManager = await SalesManager.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    );
    if (!salesManager)
      return res.status(404).json({ message: "Sales Manager not found" });
    res.status(200).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Sales Manager
export const deleteSalesManager = async (req, res) => {
  try {
    const salesManager = await SalesManager.findByIdAndDelete(req.params.id);
    if (!salesManager)
      return res.status(404).json({ message: "Sales Manager not found" });
    res.status(200).json({ message: "Sales Manager deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
