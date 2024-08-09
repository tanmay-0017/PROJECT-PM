import Attendant from '../Models/Attendant.js';

export const getInfo = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await Attendant.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateAttendant = async (req, res) => {
  const { employeeId } = req.params;
  const { name, email, country, location, postalCode, aadharCard } = req.body;

  try {
    const updatedAttendant = await Attendant.findOneAndUpdate(
      { employeeId },
      { 
        name, 
        email, 
        country, 
        location, 
        postalCode, 
        aadharCard 
      },
      { new: true, runValidators: true }
    );
    if (!updatedAttendant) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(updatedAttendant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteAttendant = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const deletedAttendant = await Attendant.findOneAndDelete({ employeeId });
    if (!deletedAttendant) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
