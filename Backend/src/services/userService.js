import userRepository from '../repositories/userRepository.js';
const repo = new userRepository();

export default class UserService {
    findByUsername = async (username) => {
        const returnArray = await repo.findByUsername(username);
        return returnArray;
    }
    createUser = async (user) => {
        const returnArray = await repo.createUser(user);
        return returnArray;
    }
    deleteUser = async (username) => {
        const returnArray = await repo.deleteUser(username);
        return returnArray;
    }
}
