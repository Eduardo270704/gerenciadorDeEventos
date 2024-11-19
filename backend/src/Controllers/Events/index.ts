import { Request, Response } from "express";
import { Event } from "../../models";

interface ParamsWithId {
  id: string;
}

export const createEvent = async (req: Request, res: Response) => {
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
};

export const getAllEvents = async (req: Request, res: Response) => {
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
};

export const getEventById = async (
  req: Request<ParamsWithId>,
  res: Response
) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evento não encontrado." });
    res.json(event);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Erro desconhecido." });
    }
  }
};

export const updateEvent = async (
  req: Request<ParamsWithId>,
  res: Response
) => {
  const { id } = req.params; // Certifique-se de usar "id" aqui, conforme tipagem
  const { title, description, date, location } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, location },
      { new: true } // Retornar o documento atualizado
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Evento não encontrado." });
    res.json(updatedEvent);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Erro desconhecido." });
    }
  }
};

export const deleteEvent = async (
  req: Request<ParamsWithId>,
  res: Response
) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Evento não encontrado." });
    res.json({ message: "Evento removido com sucesso." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Erro desconhecido." });
    }
  }
};
