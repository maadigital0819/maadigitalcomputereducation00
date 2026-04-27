/**
 * Form Validator – Handles form validation and submission
 * Professional form handling with real-time validation feedback
 */

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      console.error(`FormValidator: No form found for selector "${formSelector}"`);
      return;
    }
    
    this.fields = {
      name: this.form.querySelector('[name="name"]'),
      email: this.form.querySelector('[name="email"]'),
      subject: this.form.querySelector('[name="subject"]'),
      message: this.form.querySelector('[name="message"]'),
      phone: this.form.querySelector('[name="phone"]')
    };
    
    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.feedbackContainer = this.form.querySelector('#formFeedback');
    this.isSubmitting = false;
    
    this._attachEvents();
  }

  _attachEvents() {
    // Real-time validation on input
    Object.values(this.fields).forEach(field => {
      if (!field) return;
      field.addEventListener('blur', () => this._validateField(field));
      field.addEventListener('input', () => this._validateField(field));
    });
    
    // Form submission
    this.form.addEventListener('submit', e => this._handleSubmit(e));
  }

  _validateField(field) {
    if (!field) return true;
    
    const name = field.name;
    const value = field.value.trim();
    let error = '';
    let isValid = true;

    switch (name) {
      case 'name':
        if (!value) {
          error = 'Name is required.';
          isValid = false;
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters.';
          isValid = false;
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          error = 'Name contains invalid characters.';
          isValid = false;
        }
        break;
        
      case 'email':
        if (!value) {
          error = 'Email is required.';
          isValid = false;
        } else if (!this._isValidEmail(value)) {
          error = 'Enter a valid email address.';
          isValid = false;
        }
        break;
        
      case 'subject':
        if (!value) {
          error = 'Subject is required.';
          isValid = false;
        } else if (value.length < 4) {
          error = 'Subject must be at least 4 characters.';
          isValid = false;
        }
        break;
        
      case 'message':
        if (!value) {
          error = 'Message is required.';
          isValid = false;
        } else if (value.length < 10) {
          error = 'Message must be at least 10 characters.';
          isValid = false;
        }
        break;
        
      case 'phone':
        if (value && !/^\+?\d{10,15}$/.test(value.replace(/\s|-/g, ''))) {
          error = 'Enter a valid phone number (10-15 digits).';
          isValid = false;
        }
        break;
    }

    this._updateFieldStatus(field, isValid, error);
    return isValid;
  }

  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  _updateFieldStatus(field, isValid, errorMessage) {
    const errorEl = field.closest('.form-group').querySelector('.error-message');
    
    if (!isValid) {
      field.classList.remove('valid');
      field.classList.add('error');
      if (errorEl) {
        errorEl.textContent = errorMessage;
        errorEl.style.display = 'block';
      }
    } else {
      field.classList.remove('error');
      field.classList.add('valid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }
  }

  _validateForm() {
    let isFormValid = true;
    
    Object.values(this.fields).forEach(field => {
      if (field && !this._validateField(field)) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }

  async _handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    if (!this._validateForm()) {
      this._showFeedback('Please correct the highlighted errors.', 'error');
      return;
    }

    this.isSubmitting = true;
    const originalBtnText = this.submitBtn.textContent;
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(this.form);
      
      const response = await fetch('contact.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        this._showFeedback('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
        this.form.reset();
        
        // Clear field statuses
        Object.values(this.fields).forEach(f => {
          if (f) {
            f.classList.remove('valid', 'error');
            const errorEl = f.closest('.form-group')?.querySelector('.error-message');
            if (errorEl) errorEl.textContent = '';
          }
        });
      } else {
        const errorMsg = result.error || result.message || 'An error occurred. Please try again.';
        this._showFeedback(errorMsg, 'error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      this._showFeedback('Unable to send message. Please check your connection and try again.', 'error');
    } finally {
      this.isSubmitting = false;
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = originalBtnText;
    }
  }

  _showFeedback(message, type) {
    if (!this.feedbackContainer) {
      // Create feedback container if it doesn't exist
      this.feedbackContainer = document.createElement('div');
      this.feedbackContainer.id = 'formFeedback';
      this.feedbackContainer.className = 'form-feedback';
      this.form.appendChild(this.feedbackContainer);
    }

    this.feedbackContainer.textContent = message;
    this.feedbackContainer.className = `form-feedback ${type}`;
    this.feedbackContainer.style.animation = 'none';
    
    // Trigger animation
    setTimeout(() => {
      this.feedbackContainer.style.animation = 'fadeInUp 0.4s ease-out';
    }, 10);

    // Auto-hide success messages after 6 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.feedbackContainer.style.animation = 'fadeInUp 0.4s ease-out reverse';
      }, 6000);
    }
  }
}

// Initialize validator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('#contactForm');
});