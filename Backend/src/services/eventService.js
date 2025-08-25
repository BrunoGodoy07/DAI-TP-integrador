import eventRepository from '../repositories/eventRepository.js';
const repo = new eventRepository();

export default class eventService {
  getAllAsync = async () => {
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }

  getCapacity = async (id) => {
    const returnArray = await repo.getCapacity(id);
    return returnArray;
  }

  getCreator = async (id) => {
    const returnArray = await repo.getCreator(id);
    return returnArray;
  }

  createEvent = async (insertContents) => {
    const returnArray = await repo.createEvent(insertContents);
    return returnArray;
  }

  updateEvent = async (insertContents, id) => {
    const returnArray = await repo.updateEvent(insertContents, id);
    return returnArray;
  }
  
  deleteEvent = async (id) => {
    const returnArray = await repo.deleteEvent(id);
    return returnArray;
  }

  searchEvents = async (filters) => {
    const returnArray = await repo.searchEvents(filters);
    return returnArray;
  }

  getById = async (id) => {
    const returnArray = await repo.getById(id);
    return returnArray;
  }
  
  enrollUser = async (id, userId) => {
    const returnArray = await repo.enrollUser(id, userId);
    return returnArray;
  }

  unenrollUser = async (id, userId) => {
    const returnArray = await repo.unenrollUser(id, userId);
    return returnArray;
  }

  checkEventEnrollments = async (id) => {
    const returnArray = await repo.checkEventEnrollments(id);
    return returnArray;
  }
}
