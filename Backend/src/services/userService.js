import repo from '../repositories/userRepository.js';

findByUsername = async (username) => {
    return await repo.findByUsername(username);
}

createUser = async (user) => {
    return await repo.createUser(user);
}

export default { findByUsername, createUser };
