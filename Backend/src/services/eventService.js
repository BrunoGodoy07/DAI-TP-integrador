import eventRepository from '../repositories/province-repository.js';

export default class ProvinceService {
  getAllAsync = async () => {
    const repo = new EventRepository();
    const returnArray = await repo.getAllAsync();
    return returnArray;
  }
}
