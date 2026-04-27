// Admission Page - JavaScript
// Handles course enrollment form and auto-selection

const admissionForm = document.getElementById('admissionForm');
const courseDetailsAdmission = document.getElementById('courseDetailsAdmission');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');

let selectedCourse = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCourseDetails();
  attachFormListeners();
});

// Load course details from URL parameter or show selector
function loadCourseDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('courseId');

  if (courseId) {
    // Course ID provided - auto-load it
    const course = coursesData.find(c => c.id == courseId);

    if (!course) {
      showError('Course not found. Please select a valid course.');
      setTimeout(() => {
        window.location.href = 'courses.html';
      }, 2000);
      return;
    }

    selectedCourse = course;
    document.getElementById('courseId').value = course.id;
    document.getElementById('courseName').value = course.title;
    displayCourseDetails(course);
    
    // Hide selector, show course details
    document.getElementById('courseSelectorCard').style.display = 'none';
    document.getElementById('selectedCourseCard').style.display = 'block';
  } else {
    // No course selected - show course selector
    populateCourseSelector();
    document.getElementById('courseSelectorCard').style.display = 'block';
    document.getElementById('selectedCourseCard').style.display = 'none';
  }
}

// Populate course selector dropdown
function populateCourseSelector() {
  const courseSelect = document.getElementById('courseSelect');
  
  coursesData.forEach(course => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = `${course.title} (${course.level.charAt(0).toUpperCase() + course.level.slice(1)})`;
    courseSelect.appendChild(option);
  });
}

// Handle course selection from dropdown
function selectCourseFromDropdown() {
  const courseSelect = document.getElementById('courseSelect');
  const courseId = courseSelect.value;

  if (!courseId) {
    document.getElementById('courseSelectError').textContent = 'Please select a course';
    document.getElementById('courseSelectError').classList.add('show');
    return;
  }

  const course = coursesData.find(c => c.id == parseInt(courseId));
  
  if (!course) {
    showError('Course not found');
    return;
  }

  selectedCourse = course;
  document.getElementById('courseId').value = course.id;
  document.getElementById('courseName').value = course.title;
  
  displayCourseDetails(course);
  
  // Hide selector, show course details
  document.getElementById('courseSelectorCard').style.display = 'none';
  document.getElementById('selectedCourseCard').style.display = 'block';
  
  // Scroll to form
  document.querySelector('.enrollment-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Display course details on page
function displayCourseDetails(course) {
  const levelColors = {
    beginner: '#3498db',
    intermediate: '#9b59b6',
    advanced: '#e74c3c'
  };

  const detailsHTML = `
    <div class="course-image-admission">
      <img src="${course.image}" alt="${course.title}" loading="lazy">
    </div>
    
    <div class="course-title-admission">${course.title}</div>
    
    <div class="course-description-admission">${course.description}</div>

    <div class="course-meta-admission">
      <div class="meta-item-admission">
        <span class="meta-value-admission" style="color: ${levelColors[course.level]}">${course.level.charAt(0).toUpperCase() + course.level.slice(1)}</span>
        <span class="meta-label-admission">Level</span>
      </div>
      <div class="meta-item-admission">
        <span class="meta-value-admission">${course.weeks}</span>
        <span class="meta-label-admission">Weeks</span>
      </div>
      <div class="meta-item-admission">
        <span class="meta-value-admission">${course.price}</span>
        <span class="meta-label-admission">Price</span>
      </div>
    </div>

    <div class="course-meta-admission">
      <div class="meta-item-admission">
        <span class="meta-value-admission">${course.students}</span>
        <span class="meta-label-admission">Students</span>
      </div>
      <div class="meta-item-admission">
        <span class="meta-value-admission">${course.rating}</span>
        <span class="meta-label-admission">Rating</span>
      </div>
      <div class="meta-item-admission">
        <span class="meta-value-admission">${course.reviews}</span>
        <span class="meta-label-admission">Reviews</span>
      </div>
    </div>

    <div class="course-details-list-admission">
      <h4>What You'll Learn:</h4>
      <ul>
        ${course.details.map(detail => `<li>${detail}</li>`).join('')}
      </ul>
    </div>
  `;

  courseDetailsAdmission.innerHTML = detailsHTML;
}

// Attach form event listeners
function attachFormListeners() {
  admissionForm.addEventListener('submit', handleFormSubmit);

  // Real-time validation
  const inputs = admissionForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('focus', () => clearFieldError(input));
  });
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  // Validate all fields
  if (!validateForm()) {
    return;
  }

  // Prepare form data
  const formData = new FormData(admissionForm);
  const data = {
    courseId: formData.get('courseId'),
    courseName: formData.get('courseName'),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    qualification: formData.get('qualification'),
    experience: formData.get('experience'),
    motivation: formData.get('motivation'),
    enrollmentDate: new Date().toLocaleString(),
    status: 'enrolled'
  };

  // Disable submit button
  const submitBtn = admissionForm.querySelector('.enroll-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Processing...</span>';

  // Simulate API call (in real application, send to backend)
  setTimeout(() => {
    submitEnrollment(data);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Complete Enrollment</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L19 7"></path></svg>';
  }, 1500);
}

// Submit enrollment
function submitEnrollment(data) {
  // Save to localStorage (simulating backend storage)
  let enrollments = JSON.parse(localStorage.getItem('maaDigitalEnrollments') || '[]');
  enrollments.push(data);
  localStorage.setItem('maaDigitalEnrollments', JSON.stringify(enrollments));

  // Show success modal
  showSuccessModal(data);

  // Reset form
  admissionForm.reset();
}

// Show success modal
function showSuccessModal(data) {
  const successMessage = document.getElementById('successMessage');
  const successDetails = document.getElementById('successDetails');

  successMessage.textContent = `Congratulations! You have been successfully enrolled in ${data.courseName}.`;

  const detailsHTML = `
    <p><strong>Course:</strong> ${data.courseName}</p>
    <p><strong>Name:</strong> ${data.fullName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Enrollment Date:</strong> ${data.enrollmentDate}</p>
    <p style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e8e8e8;">
      A confirmation email has been sent to <strong>${data.email}</strong>
    </p>
  `;

  successDetails.innerHTML = detailsHTML;
  successModal.style.display = 'flex';
}

// Show error modal
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorModal.style.display = 'flex';
}

// Close error modal
function closeErrorModal() {
  errorModal.style.display = 'none';
}

// Validate form
function validateForm() {
  const inputs = admissionForm.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  // Check agreement checkbox
  const agreement = document.getElementById('agreement');
  if (!agreement.checked) {
    showFieldError(agreement, 'Please agree to terms and conditions');
    isValid = false;
  }

  return isValid;
}

// Validate individual field
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;

  let isValid = true;
  let errorMessage = '';

  if (!value) {
    isValid = false;
    errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
  } else {
    switch (fieldName) {
      case 'fullName':
        if (value.length < 3) {
          isValid = false;
          errorMessage = 'Name must be at least 3 characters';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
          isValid = false;
          errorMessage = 'Please enter a valid 10-digit phone number';
        }
        break;

      case 'motivation':
        if (value.length < 10) {
          isValid = false;
          errorMessage = 'Motivation must be at least 10 characters';
        }
        break;
    }
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldError(field);
  }

  return isValid;
}

// Show field error
function showFieldError(field, message) {
  const formGroup = field.closest('.form-group');
  const errorElement = formGroup.querySelector('.error-message');

  formGroup.classList.add('has-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

// Clear field error
function clearFieldError(field) {
  const formGroup = field.closest('.form-group');
  const errorElement = formGroup.querySelector('.error-message');

  formGroup.classList.remove('has-error');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}
