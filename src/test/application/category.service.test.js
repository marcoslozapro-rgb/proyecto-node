import { jest } from "@jest/globals";
import CategoryService from "../../application/use-cases/category.service.js";

describe("CategoryService", () => {
    it("deberia crear una categoria correctamente", async () => {
        const mockCategoryRepository = {
            save: jest.fn().mockResolvedValue({
                id: 1,
                name: "Ideas",
                userId: "user_123"
            })
        };

        const categoryService = new CategoryService(mockCategoryRepository);

        const data = {
            name: "Ideas",
            userId: "user_123"
        };

        const result = await categoryService.createCategory(data);

        expect(result).toHaveProperty("id");
        expect(result.name).toBe("Ideas");
        expect(result.userId).toBe("user_123");
        expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
    });
});