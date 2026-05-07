import CategoryEntity from "../../domain/entities/category.entity.js";

export default class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async createCategory(data) {
        if (!data.name) {
            throw new Error("Category name is required");
        }

        const category = new CategoryEntity(data);
        return await this.categoryRepository.save(category);
    }

    async getCategoriesByUserId(userId) {
        return await this.categoryRepository.findByUserId(userId);
    }
    ensureOwnership(category, currentUserId) {
        if (!category) {
            throw new Error("Category not found");
        }

        if (String(category.userId) !== String(currentUserId)) {
            throw new Error("Unauthorized access to this category");
        }
    }

    async updateCategory(id, data, currentUserId) {
        const category = await this.categoryRepository.findById(id);

        this.ensureOwnership(category, currentUserId);

        const updatedCategory = await this.categoryRepository.update(id, data);

        if (!updatedCategory) {
            throw new Error("Category not found");
        }

        return updatedCategory;
    }

    async deleteCategory(id, currentUserId) {
        const category = await this.categoryRepository.findById(id);

        this.ensureOwnership(category, currentUserId);

        const deleted = await this.categoryRepository.delete(id);

        if (!deleted) {
            throw new Error("Category not found");
        }

        return { message: "Category deleted successfully" };
    }
}