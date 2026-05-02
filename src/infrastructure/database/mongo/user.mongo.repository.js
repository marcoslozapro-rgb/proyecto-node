import UserModel from "./user.model.js";

export default class UserMongoRepository {
    async save(userEntity) {
        const user = new UserModel({
            name: userEntity.name,
            email: userEntity.email,
            password: userEntity.password,
            role: userEntity.role
        });

        const savedUser = await user.save();
        return savedUser.toObject();
    }

    async findByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async findById(id) {
        return await UserModel.findById(id);
    }
}