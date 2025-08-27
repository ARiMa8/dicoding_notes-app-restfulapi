const BASE_URL = 'https://notes-api.dicoding.dev/v2';

class NotesApi {
  static async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(`Failed to fetch archived notes: ${error.message}`);
    }
  }

  static async getSingleNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`);
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(`Failed to fetch note: ${error.message}`);
    }
  }

  static async createNote(title, body) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
        }),
      });

      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }

  static async archiveNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
        method: 'POST',
      });

      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Failed to archive note: ${error.message}`);
    }
  }

  static async unarchiveNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
        method: 'POST',
      });

      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Failed to unarchive note: ${error.message}`);
    }
  }

  static async deleteNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });

      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  }
}

export default NotesApi;
