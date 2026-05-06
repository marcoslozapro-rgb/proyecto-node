// importante al trabajar con nuestros archivos debemos añadir al final .js requerido para ESM
import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
    constructor(noteRepository, mailService) {
        this.noteRepository = noteRepository;
        this.mailService = mailService;
    }

    async createNote(data) {
        if (!data.title || !data.content) { throw new Error("Title and content are required"); }

        const note = new NoteEntity(data);
        return await this.noteRepository.save(note);
    }

    async getNotesByUserId(userId) {
        return await this.noteRepository.findByUserId(userId);
    }
    async getPublicNoteById(id) {
        const note = await this.noteRepository.findById(id);

        if (!note) {
            throw new Error("Note not found");
        }

        if (note.isPrivate === true) {
            throw new Error("Forbidden: This note is private");
        }

        return note;
    }
    async updateNote(id, data, currentUserId) {
        const note = await this.noteRepository.findById(id);

        if (!note) throw new Error("Note not found");

        if (note.userId !== currentUserId) {
            throw new Error("Unauthorized: You can only update your own notes");
        }

        const updatedNote = await this.noteRepository.update(id, data);
        return updatedNote;
    }

    async deleteNote(id, currentUserId) {
        const note = await this.noteRepository.findById(id);

        if (!note) throw new Error("Note not found");

        if (note.userId !== currentUserId) {
            throw new Error("Unauthorized: You can only delete your own notes");
        }

        await this.noteRepository.delete(id);
        return { message: "Note deleted successfully" };
    }

    async getNoteById(id) {
        const note = await this.noteRepository.findById(id);
        if (!note) throw new Error("Note not found");
        return note;
    }

    async shareNoteByEmail(noteId, targetEmail, currentUserId) {
        const note = await this.noteRepository.findById(noteId);
        if (!note) throw new Error("Note not found");

        // RESTRICCIÓN: Solo el dueño puede compartirla
        if (note.userId !== currentUserId) {
            throw new Error("Unauthorized: You can only share your own notes");
        }

        return await this.mailService.sendNoteEmail(targetEmail, note);
    }
}