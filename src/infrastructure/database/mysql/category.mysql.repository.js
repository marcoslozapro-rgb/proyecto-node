import CategoryModel from "./models/category.model.js";

export default class CategoryMySQLRepository {
    async save(categoryEntity) {
        const category = await CategoryModel.create({
            name: categoryEntity.name,
            userId: categoryEntity.userId,
        });

        return category.toJSON();
    }

    async findByUserId(userId) {
        return await CategoryModel.findAll({
            where: { userId },
        });
    }
}