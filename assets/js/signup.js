/**
 * Economic Group — Account Signup Module
 * Validates the registration form (Full Name, Email, Phone, Address — all
 * required), submits it via SheetsAPI.submitSignup (writes to the "New
 * Clients" sheet tab and triggers the admin + client emails server-side),
 * then redirects to thank-you.html on success.
 */

(function () {
  const { qs, qsa, isValidEmail } = window.StockUtils;

  function showFieldError(field, message) {
    const errorEl = field.parentElement.querySelector('.form-error-msg');
    field.classList.add('has-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
  }

  function clearFieldError(field) {
    const errorEl = field.parentElement.querySelector('.form-error-msg');
    field.classList.remove('has-error');
    if (errorEl) errorEl.classList.remove('is-visible');
  }

  /**
   * Strips any non-digit character as the user types and caps the value
   * at 11 digits, so letters/symbols can never enter the phone field.
   */
  function initPhoneDigitsOnly(form) {
    const phoneField = qs('#signup-phone', form);
    if (!phoneField) return;
    phoneField.addEventListener('input', () => {
      const digitsOnly = phoneField.value.replace(/\D/g, '').slice(0, 11);
      if (digitsOnly !== phoneField.value) phoneField.value = digitsOnly;
    });
  }

  function validateForm(form) {
    let isValid = true;
    const nameField = qs('#signup-name', form);
    const emailField = qs('#signup-email', form);
    const phoneField = qs('#signup-phone', form);
    const addressField = qs('#signup-address', form);
    const requiredMsg = window.I18n.t('contact_form.required_field');
    const emailMsg = window.I18n.t('contact_form.invalid_email');
    const phoneMsg = window.I18n.t('account.invalid_phone');

    [nameField, addressField].forEach((field) => {
      if (!field.value.trim()) {
        showFieldError(field, requiredMsg);
        isValid = false;
      } else {
        clearFieldError(field);
      }
    });

    if (!phoneField.value.trim()) {
      showFieldError(phoneField, requiredMsg);
      isValid = false;
    } else if (phoneField.value.trim().length !== 11) {
      showFieldError(phoneField, phoneMsg);
      isValid = false;
    } else {
      clearFieldError(phoneField);
    }

    if (!emailField.value.trim()) {
      showFieldError(emailField, requiredMsg);
      isValid = false;
    } else if (!isValidEmail(emailField.value.trim())) {
      showFieldError(emailField, emailMsg);
      isValid = false;
    } else {
      clearFieldError(emailField);
    }

    return isValid;
  }

  function initFieldBlurValidation(form) {
    qsa('input, textarea', form).forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.hasAttribute('required') && !field.value.trim()) {
          showFieldError(field, window.I18n.t('contact_form.required_field'));
        } else if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value.trim())) {
          showFieldError(field, window.I18n.t('contact_form.invalid_email'));
        } else if (field.id === 'signup-phone' && field.value.trim() && field.value.trim().length !== 11) {
          showFieldError(field, window.I18n.t('account.invalid_phone'));
        } else {
          clearFieldError(field);
        }
      });
    });
  }

  function initForm() {
    const form = qs('#signup-form');
    if (!form) return;
    const statusEl = qs('#signup-form-status');

    initFieldBlurValidation(form);
    initPhoneDigitsOnly(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(form)) {
        qs('.has-error', form)?.focus();
        return;
      }

      const submitBtn = qs('button[type="submit"]', form);
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> ${window.I18n.t('account.sending')}`;
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      const payload = {
        Name: qs('#signup-name', form).value.trim(),
        Email: qs('#signup-email', form).value.trim(),
        Phone: qs('#signup-phone', form).value.trim(),
        Address: qs('#signup-address', form).value.trim(),
        Language: window.I18n.getLanguage()
      };

      window.SheetsAPI.submitSignup(payload)
        .then(() => {
          window.location.href = '../thank-you/';
        })
        .catch(() => {
          statusEl.textContent = window.I18n.t('account.error');
          statusEl.className = 'form-status error';
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        });
    });
  }

  function init() {
    window.StockPageChrome.init('../../').then(initForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
