import './assets/styles/style.css';

import './components/app-bar.js';
import './components/loading-indicator.js';
import './components/note-form.js';
import './components/note-item.js';

import NotesApi from './utils/api.js';
import anime from 'animejs';
import Swal from 'sweetalert2';

class NotesApp {
  constructor() {
    this.activeTab = 'active';
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.loadNotes();

    window.addEventListener('notes-updated', () => {
      this.loadNotes();
    });
  }

  attachEventListeners() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', e => {
        this.switchTab(e.target.dataset.tab);
      });
    });
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.querySelector(`#${tabName}-notes`).classList.add('active');

    this.loadNotes();
  }

  async loadNotes() {
    const loadingIndicator = document.querySelector('#loading');

    try {
      loadingIndicator.show();

      if (this.activeTab === 'active') {
        const notes = await NotesApi.getAllNotes();
        this.renderNotes(notes, 'active-notes-grid');
      } else {
        const archivedNotes = await NotesApi.getArchivedNotes();
        this.renderNotes(archivedNotes, 'archived-notes-grid');
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Gagal memuat catatan: ${error.message}`,
        confirmButtonColor: '#45B8FE',
      });
    } finally {
      loadingIndicator.hide();
    }
  }

  renderNotes(notes, containerId) {
    const container = document.querySelector(`#${containerId}`);

    if (notes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>${this.activeTab === 'active' ? 'Belum ada catatan' : 'Belum ada catatan arsip'}</h3>
          <p>${
            this.activeTab === 'active'
              ? 'Mulai dengan membuat catatan pertama Anda!'
              : 'Catatan yang diarsipkan akan muncul di sini.'
          }</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    notes.forEach((note, index) => {
      const noteElement = document.createElement('note-item');
      noteElement.note = note;

      noteElement.style.opacity = '0';
      noteElement.style.transform = 'translateY(30px)';

      container.appendChild(noteElement);

      anime({
        targets: noteElement,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        delay: index * 100,
        easing: 'easeOutQuart',
      });
    });
  }

  initAnimations() {
    anime({
      targets: '.note-form-section',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      easing: 'easeOutQuart',
    });

    anime({
      targets: '.notes-tabs',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: 200,
      easing: 'easeOutQuart',
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new NotesApp();

  setTimeout(() => {
    app.initAnimations();
  }, 100);

  document.addEventListener('click', e => {
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('form-button') ||
        e.target.classList.contains('note-action-button'))
    ) {
      anime({
        targets: e.target,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeOutQuart',
      });
    }
  });

  document.addEventListener(
    'mouseenter',
    e => {
      if (
        e.target &&
        e.target.classList &&
        e.target.classList.contains('note-item')
      ) {
        anime({
          targets: e.target,
          scale: 1.02,
          duration: 300,
          easing: 'easeOutQuart',
        });
      }
    },
    true,
  );

  document.addEventListener(
    'mouseleave',
    e => {
      if (
        e.target &&
        e.target.classList &&
        e.target.classList.contains('note-item')
      ) {
        anime({
          targets: e.target,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuart',
        });
      }
    },
    true,
  );
});
