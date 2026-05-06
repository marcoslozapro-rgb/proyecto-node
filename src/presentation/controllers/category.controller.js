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
}