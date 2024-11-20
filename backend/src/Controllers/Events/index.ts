import { Request, Response } from "express";
import { Event } from "../../models";

class EventController {
  // Criar evento
  public async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, date, location } = req.body;
      const newEvent = new Event({ title, description, date, location });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Erro desconhecido." });
      }
    }
  }

  // Obter todos os eventos
  public async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Erro desconhecido." });
      }
    }
  }

  // Obter evento por ID
  public async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const event = await Event.findById(req.params._id);
      if (!event) {
        res.status(404).json({ message: "Evento não encontrado." });
        return;
      }
      res.json(event);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Erro desconhecido." });
      }
    }
  }

  // Atualizar evento
  public async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, date, location } = req.body;
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params._id,
        { title, description, date, location },
        { new: true, runValidators: true }
      );
      if (!updatedEvent) {
        res.status(404).json({ message: "Evento não encontrado." });
        return;
      }
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Erro desconhecido." });
      }
    }
  }

  // Remover evento
  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params._id);
      if (!deletedEvent) {
        res.status(404).json({ message: "Evento não encontrado." });
        return;
      }
      res.json({ message: "Evento removido com sucesso." });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Erro desconhecido." });
      }
    }
  }
}

export default new EventController();
