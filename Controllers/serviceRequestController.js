import ServiceRequest from '../Models/serviceRequest.js';
import Customer from '../Models/customer.js';
import Service from '../Models/Service.js';
import ServicePerson from '../Models/ServicePerson.js';

export const requestService = async (req, res) => {
    const { name, mobileNo, customerId, type, projectName } = req.body;

    try {
        const customer = await Customer.findOne({ customerId: customerId });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customerCredentials = await Customer.findOne({
            customerId: customerId,
            name: name,
            mobileNo: mobileNo,
            projectName: projectName
        });

        if (!customerCredentials) {
            return res.status(404).json({ message: 'Incorrect Customer Credentials' });
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

        const serviceRequest = await ServiceRequest.create({
            name,
            mobileNo,
            customerId,
            type,
            projectName,
            servicePerson: availableServicePerson._id,
            servicePersonName: availableServicePerson.name
        });

        res.status(200).json({
            name,
            mobileNo,
            customerId,
            type,
            projectName,
            servicePerson: availableServicePerson,
            servicePersonName: availableServicePerson.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};