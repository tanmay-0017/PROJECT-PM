import SalesManager from '../Models/salesManager.js';


export const getSalesManagerInfo = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const salesManager = await SalesManager.findOne({ employeeId });
    if (!salesManager) {
      return res.status(404).json({ message: 'Sales Manager not found' });
    }
    res.status(200).json(salesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateSalesManager = async (req, res) => {
  const { employeeId } = req.params;
  const { name, emailID, country, location, postalCode, aadharCard } = req.body;

  try {
    const updatedSalesManager = await SalesManager.findOneAndUpdate(
      { employeeId },
      { 
        name, 
        emailID, 
        country, 
        location, 
        postalCode, 
        aadharCard 
      },
      { new: true, runValidators: true }
    );
    if (!updatedSalesManager) {
      return res.status(404).json({ message: 'Sales Manager not found' });
    }
    res.status(200).json(updatedSalesManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteSalesManager = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const deletedSalesManager = await SalesManager.findOneAndDelete({ employeeId });
    if (!deletedSalesManager) {
      return res.status(404).json({ message: 'Sales Manager not found' });
    }
    res.status(200).json({ message: 'Sales Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

