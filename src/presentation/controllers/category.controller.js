export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req, res) => {
        try {
            const data = req.body;
            data.userId = req.user.id;

            const category = await this.categoryService.createCategory(data);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getCategoriesByUserId = async (req, res) => {
        try {
            const userId = req.user.id;

            const categories = await this.categoryService.getCategoriesByUserId(userId);
            res.status(200).json(categories);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const currentUserId = req.user.id;

            const category = await this.categoryService.updateCategory(id, data, currentUserId);

            res.status(200).json(category);
        } catch (error) {
            if (error.message === "Category not found") {
                return res.status(404).json({ error: error.message });
            }

            if (error.message.startsWith("Unauthorized")) {
                return res.status(403).json({ error: error.message });
            }

            res.status(400).json({ error: error.message });
        }
    }

    deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const currentUserId = req.user.id;

            const result = await this.categoryService.deleteCategory(id, currentUserId);

            res.status(200).json(result);
        } catch (error) {
            if (error.message === "Category not found") {
                return res.status(404).json({ error: error.message });
            }

            if (error.message.startsWith("Unauthorized")) {
                return res.status(403).json({ error: error.message });
            }

            res.status(400).json({ error: error.message });
        }
    }
}