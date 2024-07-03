import ServicePerson from '../Models/ServicePerson.js';
import asyncHandler from '../utils/asyncHandler.js';


export const getServices = asyncHandler(async (req, res) => {
  const services = await ServicePerson.find({});
  res.json(services);
});


export const createServicePerson = asyncHandler(async (req, res) => {
  const { type, name } = req.body;

  const servicePerson = new ServicePerson({
    type,
    name,
  });

  const createdServicePerson = await servicePerson.save();
  res.status(201).json(createdServicePerson);
});


export const getServicePersonById = asyncHandler(async (req, res) => {
  const servicePerson = await ServicePerson.findById(req.params.id);

  if (servicePerson) {
    res.json(servicePerson);
  } else {
    res.status(404);
    throw new Error('service Person not found');
  }
});


export const updateServiceById = asyncHandler(async (req, res) => {
  const { type, name } = req.body;

  const servicePerson = await ServicePerson.findById(req.params.id);

  if (servicePerson) {
    service.type = type;
    service.name = name;

    const updatedService = await servicePerson.save();
    res.json(updatedService);
  } else {
    res.status(404);
    throw new Error('Service Person not found');
  }
});


export const deleteService = asyncHandler(async (req, res) => {
  const service = await ServicePerson.findById(req.params.id);

  if (service) {
    await service.remove();
    res.json({ message: 'Service Person removed' });
  } else {
    res.status(404);
    throw new Error('Service Person not found');
  }
});
