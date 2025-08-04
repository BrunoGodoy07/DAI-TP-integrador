import eventRepository from '../repositories/eventRepository.js';
const repo = new eventRepository();

export default class eventService {
  getAllAsync = async () => {
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }

  createEvent = async (insertContents) => {
    const returnArray = await repo.createEvent(insertContents);
    return returnArray;
  }
}
