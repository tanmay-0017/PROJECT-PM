import ServiceRequest from '../Models/serviceRequest.js';
import Customer from '../Models/customer.js';
import Service from '../Models/Service.js';
import ServicePerson from '../Models/ServicePerson.js';

export const requestService = async (req, res) => {
    const { name, mobileNo, customerId, type, projectName } = req.body;

    try {
        if (!name || !mobileNo || !customerId || !type || !projectName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const customer = await Customer.findOne({ customerId: customerId });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (customer.name !== name || customer.mobile !== mobileNo || customer.projectName !== projectName) {
            return res.status(401).json({ message: 'Incorrect Customer Credentials' });
        }

        const serviceFound = await Service.findOne({ serviceType: type });

        if (!serviceFound) {
            return res.status(404).json({ message: 'Service Type Not Found' });
        }

        const availableServicePerson = await ServicePerson.findOneAndUpdate(
            { status: 'available', type: type },
            { status: 'assigned' },
            { new: true }
        );

        if (!availableServicePerson) {
            return res.status(404).json({ message: 'No available service person found' });
        }

        await ServiceRequest.create({
            name,
            mobileNo,
            customerId,
            typeOfService: type,
            projectName,
            servicePerson: availableServicePerson._id,
            servicePersonName: availableServicePerson.name
        });

        res.status(200).json({
            name,
            mobileNo,
            customerId,
            typeOfService: type,
            projectName,
            servicePerson: availableServicePerson,
            servicePersonName: availableServicePerson.name
        });
    } catch (error) {
        console.error('Error processing service request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getrequestService = async(req, res) => {
    const {mobileNo} = req.body;

    if (!mobileNo){
        return res.status(400).json({ message: 'Mobile Number is required' });
    }

    const customer = await Customer.findOne({mobile: mobileNo});

    if (!customer){
        return res.status(401).json({ message: 'This customer number does not exist'});
    }

    res.status(200).json({
        name: customer.name,
        customerId: customer.customerId,
        projectName: customer.projectName,
    });
}
