import ServiceRequest from '../Models/serviceRequest.js';
import Customer from '../Models/customer.js';
import Service from '../Models/Service.js';
import ServicePerson from '../Models/ServicePerson.js';


export const requestService = async (req, res) => {
    const { name, mobileNo, customerId, type, projectName } = req.body;

    const customer = Customer.findOne({"customerId" : customerId});

    if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
    }

    const customerCredentials = Customer.find({"name": name}, {"mobile": mobileNo}, {"projectName": projectName});

    if (!customerCredentials) {
        res.status(404).json({ message: 'Incorrect Customer Credentials' });
    }

    const serviceFound = Service.find({"serviceType": type});

    if (!serviceFound) {
        res.status(404).json({ message: 'Service Type Not Found' });
    }

    const availableServicePerson = await ServicePerson.findOneAndUpdate(
        { status: 'available', type: type },
        { 
            status: 'assigned' 
        },
        { new: true }
    );

    ServiceRequest.create({
        name,
        mobileNo,
        customerId,
        type,
        projectName,
        servicePerson: availableServicePerson,
        servicePersonName : availableServicePerson.name
    });

    res.status(200).json({
        name,
        mobileNo,
        customerId,
        type,
        projectName,
        servicePerson: availableServicePerson,
        servicePersonName : availableServicePerson.name
    })
}
