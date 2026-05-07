import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import CategoryService from "../../application/use-cases/category.service.js";
import CategoryMySQLRepository from "../../infrastructure/database/mysql/category.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const categoryRepository = new CategoryMySQLRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ideas"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token faltante o inválido
 */
router.post("/", authMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener categorías del usuario autenticado
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *       401:
 *         description: Token faltante o inválido
 */
router.get("/", authMiddleware, categoryController.getCategoriesByUserId);
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tareas"
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Categoría no encontrada
 */
router.put("/:id", authMiddleware, categoryController.updateCategory);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

export default router;