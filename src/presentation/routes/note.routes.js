import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import upload from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

//aqui definiremos que base de datos usar para las notas, en este caso MongoDB
import NoteMongoRepository from "../../infrastructure/database/mongo/note.mongo.repository.js";
import NoteMysqlRepository from "../../infrastructure/database/mysql/note.mysql.repository.js";
import MailService from "../../infrastructure/services/mail.service.js";

// inyeccion de dependencias
const mailService = new MailService();
//const noteRepository = new NoteMongoRepository();
const noteRepository = new NoteMysqlRepository();

const noteService = new NoteService(noteRepository, mailService);
const noteController = new NoteController(noteService);

const router = Router();

//definir las rutas para las notas  
//comentado sin seguuridad
//router.post("/", upload.single('image'), noteController.createNote);
//router.get("/", noteController.getNotesByUserId);

// router.post("/", authMiddleware, upload.single('image'), noteController.createNote);
// router.get("/", authMiddleware, noteController.getNotesByUserId);
// router.get("/:id", authMiddleware, noteController.getNoteById);
// router.put("/:id", authMiddleware, upload.single("image"), noteController.updateNote);
// router.delete("/:id", authMiddleware, noteController.deleteNote);



/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Crear una nueva nota
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mi Tarea Pendiente"
 *               content:
 *                 type: string
 *                 example: "Finalizar el módulo de backend hoy."
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Nota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 categoryId:
 *                   type: integer
 *       400:
 *         description: Título o contenido faltante
 */
router.post("/", authMiddleware, upload.single('image'), noteController.createNote);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Obtener todas las notas del usuario autenticado
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.get("/", authMiddleware, noteController.getNotesByUserId);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Actualizar una nota existente
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la nota
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Nota actualizada exitosamente
 *       404:
 *         description: Nota no encontrada
 */
router.put("/:id", authMiddleware, upload.single('image'), noteController.updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Eliminar una nota (Solo Admins)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note deleted successfully"
 *       403:
 *         description: Acceso denegado (Requiere rol admin)
 *       404:
 *         description: Nota no encontrada
 */
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Compartir una nota por email
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "amigo@example.com"
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully"
 *       400:
 *         description: No se pudo enviar el correo o no es dueño de la nota
 */
router.post("/:id/share", authMiddleware, noteController.shareNote);
/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Obtener una nota por ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la nota
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       404:
 *         description: Nota no encontrada
 */
router.get("/:id", authMiddleware, noteController.getNoteById);

export default router;