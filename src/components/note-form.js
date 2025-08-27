import NotesApi from '../utils/api.js';
import Swal from 'sweetalert2';

class NoteForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = this.querySelector('#note-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const titleInput = this.querySelector('#note-title');
    const bodyInput = this.querySelector('#note-body');
    const loadingIndicator = document.querySelector('#loading');

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan!',
        text: 'Judul dan isi catatan tidak boleh kosong.',
        confirmButtonColor: '#45B8FE',
      });
      return;
    }

    try {
      loadingIndicator.show();

      await NotesApi.createNote(title, body);

      titleInput.value = '';
      bodyInput.value = '';

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil ditambahkan.',
        confirmButtonColor: '#45B8FE',
        timer: 2000,
        showConfirmButton: false,
      });

      window.dispatchEvent(new CustomEvent('notes-updated'));
    } catch (error) {
      console.error('Error creating note:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Gagal menambahkan catatan: ${error.message}`,
        confirmButtonColor: '#45B8FE',
      });
    } finally {
      loadingIndicator.hide();
    }
  }

  render() {
    this.innerHTML = `
      <form id="note-form" class="note-form">
        <div class="form-group">
          <label for="note-title">Judul Catatan</label>
          <input type="text" id="note-title" maxlength="100" placeholder="Masukkan judul catatan..." required>
        </div>
        
        <div class="form-group">
          <label for="note-body">Isi Catatan</label>
          <textarea id="note-body" placeholder="Tulis catatan Anda disini..." required></textarea>
        </div>
        
        <button type="submit" class="form-button">
          Tambah Catatan
        </button>
      </form>
    `;
  }
}

customElements.define('note-form', NoteForm);
