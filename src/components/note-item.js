import NotesApi from '../utils/api.js';
import Swal from 'sweetalert2';

class NoteItem extends HTMLElement {
  constructor() {
    super();
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  get note() {
    return this._note;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const deleteButton = this.querySelector('.delete-button');
    const archiveButton = this.querySelector('.archive-button');
    const unarchiveButton = this.querySelector('.unarchive-button');

    if (deleteButton) {
      deleteButton.addEventListener('click', () => this.handleDelete());
    }

    if (archiveButton) {
      archiveButton.addEventListener('click', () => this.handleArchive());
    }

    if (unarchiveButton) {
      unarchiveButton.addEventListener('click', () => this.handleUnarchive());
    }
  }

  async handleDelete() {
    const result = await Swal.fire({
      title: 'Hapus Catatan?',
      text: 'Catatan yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#45B8FE',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      const loadingIndicator = document.querySelector('#loading');

      try {
        loadingIndicator.show();
        await NotesApi.deleteNote(this._note.id);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Catatan berhasil dihapus.',
          confirmButtonColor: '#45B8FE',
          timer: 2000,
          showConfirmButton: false,
        });

        window.dispatchEvent(new CustomEvent('notes-updated'));
      } catch (error) {
        console.error('Error deleting note:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Gagal menghapus catatan: ${error.message}`,
          confirmButtonColor: '#45B8FE',
        });
      } finally {
        loadingIndicator.hide();
      }
    }
  }

  async handleArchive() {
    const loadingIndicator = document.querySelector('#loading');

    try {
      loadingIndicator.show();
      await NotesApi.archiveNote(this._note.id);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil diarsipkan.',
        confirmButtonColor: '#45B8FE',
        timer: 2000,
        showConfirmButton: false,
      });

      window.dispatchEvent(new CustomEvent('notes-updated'));
    } catch (error) {
      console.error('Error archiving note:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Gagal mengarsipkan catatan: ${error.message}`,
        confirmButtonColor: '#45B8FE',
      });
    } finally {
      loadingIndicator.hide();
    }
  }

  async handleUnarchive() {
    const loadingIndicator = document.querySelector('#loading');

    try {
      loadingIndicator.show();
      await NotesApi.unarchiveNote(this._note.id);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil dikembalikan.',
        confirmButtonColor: '#45B8FE',
        timer: 2000,
        showConfirmButton: false,
      });

      window.dispatchEvent(new CustomEvent('notes-updated'));
    } catch (error) {
      console.error('Error unarchiving note:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Gagal mengembalikan catatan: ${error.message}`,
        confirmButtonColor: '#45B8FE',
      });
    } finally {
      loadingIndicator.hide();
    }
  }

  formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

  render() {
    if (!this._note) return;

    const { id, title, body, createdAt, archived } = this._note;

    this.className = 'note-item fade-in';
    this.innerHTML = `
      <h3 class="note-title">${title}</h3>
      <p class="note-body">${body}</p>
      <p class="note-date">Dibuat pada: ${this.formatDate(createdAt)}</p>
      <div class="note-actions">
        <button class="note-action-button delete-button">Hapus</button>
        ${
          archived
            ? '<button class="note-action-button unarchive-button">Kembalikan</button>'
            : '<button class="note-action-button archive-button">Arsipkan</button>'
        }
      </div>
    `;
  }
}

customElements.define('note-item', NoteItem);
