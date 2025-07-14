import eventRepository from '../repositories/eventRepository.js';

export default class ProvinceService {
  getAllAsync = async () => {
    const repo = new eventRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
}
