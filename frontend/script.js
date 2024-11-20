document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api/events";

  const form = document.getElementById("event-form");
  const eventList = document.getElementById("events-ul");
  const addEventBtn = document.getElementById("add-event-btn");
  const submitEventBtn = document.getElementById("submit-event-btn");
  const cancelEventBtn = document.getElementById("cancel-event-btn");

  const nameInput = document.getElementById("event-name");
  const locationInput = document.getElementById("event-location");
  const dateInput = document.getElementById("event-date");
  const descriptionInput = document.getElementById("event-description");
  const feedbackSpan = document.getElementById("form-feedback");

  let editingEventId = null;

  // Exibir formulário de evento
  addEventBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
  });

  // Ocultar formulário de evento
  cancelEventBtn.addEventListener("click", () => {
    form.classList.add("hidden");
    clearForm();
  });

  // Atualizar ou criar evento
  submitEventBtn.addEventListener("click", async () => {
    const event = {
      title: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      location: locationInput.value.trim(),
      date: dateInput.value,
    };

    if (!event.title || !event.date || !event.location) {
      feedbackSpan.textContent =
        "Por favor, preencha todos os campos obrigatórios.";
      return;
    }

    try {
      if (editingEventId) {
        await fetch(`${API_URL}/${editingEventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        });
      }
      form.classList.add("hidden");
      clearForm();
      loadEvents();
    } catch (error) {
      feedbackSpan.textContent = "Erro ao salvar o evento.";
    }
  });

  // Carregar eventos do backend
  async function loadEvents() {
    try {
      const response = await fetch(API_URL);
      const events = await response.json();
      renderEvents(events);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  }

  // Renderizar eventos no DOM
  // Card para exibir detalhes
  const eventDetailsCard = document.createElement("div");
  eventDetailsCard.id = "event-details";
  eventDetailsCard.className = "hidden";
  document.body.appendChild(eventDetailsCard);

  // Exibir detalhes do evento
  window.showEventDetails = async function (id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const event = await response.json();

      // Renderizar card com as informações
      eventDetailsCard.innerHTML = `
      <div class="card">
        <h2>${event.title}</h2>
        <p><strong>Local:</strong> ${event.location}</p>
        <p><strong>Data:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p><strong>Descrição:</strong> ${event.description}</p>
        <button id="close-details">Fechar</button>
      </div>
    `;
      eventDetailsCard.classList.remove("hidden");

      // Fechar card
      document.getElementById("close-details").addEventListener("click", () => {
        eventDetailsCard.classList.add("hidden");
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes do evento:", error);
    }
  };

  // Atualizar renderização da lista para incluir clique no evento
  function renderEvents(events) {
    eventList.innerHTML = "";
    events.forEach((event) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <strong>${event.title}</strong> - ${new Date(
        event.date
      ).toLocaleString()} - ${event.location}
      <p>${event.description}</p>
      <button onclick="editEvent('${event._id}')">Editar</button>
      <button onclick="deleteEvent('${event._id}')">Excluir</button>
      <button onclick="showEventDetails('${event._id}')">Ver Detalhes</button>
    `;
      eventList.appendChild(li);
    });
  }

  // Editar evento
  // Card para editar evento
  const editEventCard = document.createElement("div");
  editEventCard.id = "edit-event-card";
  editEventCard.className = "hidden";
  document.body.appendChild(editEventCard);

  // Exibir card de edição do evento
  window.editEvent = async function (id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const event = await response.json();

      // Renderizar card de edição
      editEventCard.innerHTML = `
      <div class="card">
        <h2>Editar Evento</h2>
        <input type="text" id="edit-event-name" value="${event.title}" />
        <input type="text" id="edit-event-location" value="${event.location}" />
        <input type="datetime-local" id="edit-event-date" value="${new Date(
          event.date
        )
          .toISOString()
          .slice(0, -1)}" />
        <textarea id="edit-event-description">${event.description}</textarea>
        <button id="save-edit-event">Salvar</button>
        <button id="cancel-edit-event">Cancelar</button>
      </div>
    `;
      editEventCard.classList.remove("hidden");

      // Fechar o modal de edição
      document
        .getElementById("cancel-edit-event")
        .addEventListener("click", () => {
          editEventCard.classList.add("hidden");
        });

      // Salvar alterações
      document
        .getElementById("save-edit-event")
        .addEventListener("click", async () => {
          const updatedEvent = {
            title: document.getElementById("edit-event-name").value.trim(),
            location: document
              .getElementById("edit-event-location")
              .value.trim(),
            date: document.getElementById("edit-event-date").value,
            description: document
              .getElementById("edit-event-description")
              .value.trim(),
          };

          if (
            !updatedEvent.title ||
            !updatedEvent.date ||
            !updatedEvent.location
          ) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
          }

          try {
            await fetch(`${API_URL}/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedEvent),
            });
            editEventCard.classList.add("hidden");
            loadEvents(); // Recarregar eventos
          } catch (error) {
            console.error("Erro ao salvar alterações:", error);
          }
        });
    } catch (error) {
      console.error("Erro ao buscar informações do evento:", error);
    }
  };

  // Deletar evento
  window.deleteEvent = async function (id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      loadEvents();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    }
  };

  // Limpar formulário
  function clearForm() {
    nameInput.value = "";
    locationInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    editingEventId = null;
    feedbackSpan.textContent = "";
  }

  // Inicializar
  loadEvents();
});
