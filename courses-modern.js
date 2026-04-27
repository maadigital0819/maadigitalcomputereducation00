// Modern Courses Page - JavaScript
// Dynamic course rendering and filtering

const coursesData = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    description: 'Learn HTML, CSS, JavaScript, and backend technologies to build modern web applications.',
    level: 'beginner',
    weeks: 12,
    students: '850+',
    price: '₹15k',
    image: 'images/gallery1.jpg',
    rating: 5,
    reviews: 245,
    tags: ['HTML/CSS', 'JavaScript', 'Backend'],
    details: [
      'Responsive web design principles',
      'JavaScript ES6+ and async programming',
      'Popular frameworks (React/Vue)',
      'Backend development with Node.js',
      'Database design and implementation',
      'REST API development',
      'Version control and deployment'
    ]
  },
  {
    id: 2,
    title: 'Data Science & AI',
    description: 'Master data analysis, machine learning, and AI tools to become a data professional.',
    level: 'intermediate',
    weeks: 16,
    students: '620+',
    price: '₹18k',
    image: 'images/gallery2.jpg',
    rating: 4,
    reviews: 186,
    tags: ['Python', 'ML', 'Analytics'],
    details: [
      'Statistical analysis fundamentals',
      'Data cleaning and visualization',
      'Machine learning algorithms',
      'Deep learning with neural networks',
      'Python libraries (pandas, scikit-learn)',
      'Real-world data projects',
      'Model deployment and monitoring'
    ]
  },
  {
    id: 3,
    title: 'Computer Networking & Security',
    description: 'Gain hands-on experience with network design, troubleshooting, and cybersecurity fundamentals.',
    level: 'beginner',
    weeks: 10,
    students: '540+',
    price: '₹12k',
    image: 'images/gallery3.jpg',
    rating: 5,
    reviews: 312,
    tags: ['Networking', 'Security', 'Hands-on'],
    details: [
      'OSI and TCP/IP models',
      'Network configuration and setup',
      'Firewalls and security protocols',
      'Intrusion detection systems',
      'VPN and encryption',
      'Network troubleshooting',
      'Ethical hacking basics'
    ]
  },
  {
    id: 4,
    title: 'Programming Fundamentals (Python)',
    description: 'Start coding with Python, covering syntax, data structures, and problem-solving techniques.',
    level: 'beginner',
    weeks: 8,
    students: '1200+',
    price: '₹8k',
    image: 'images/gallery1.jpg',
    rating: 5,
    reviews: 428,
    tags: ['Python', 'Basics', 'Beginner'],
    details: [
      'Python syntax and semantics',
      'Data types and structures',
      'Control flow and functions',
      'Object-oriented programming',
      'File handling and exceptions',
      'Popular libraries (NumPy, Pandas)',
      'Real-world project development'
    ]
  },
  {
    id: 5,
    title: 'Cloud Architecture & DevOps',
    description: 'Master AWS, Docker, Kubernetes, CI/CD pipelines, and deploy scalable cloud applications.',
    level: 'advanced',
    weeks: 14,
    students: '380+',
    price: '₹22k',
    image: 'images/gallery2.jpg',
    rating: 5,
    reviews: 156,
    tags: ['AWS', 'Docker', 'DevOps'],
    details: [
      'AWS core services (EC2, S3, RDS, Lambda)',
      'Containerization with Docker',
      'Kubernetes orchestration',
      'CI/CD pipelines with Jenkins',
      'Infrastructure as Code (Terraform)',
      'Monitoring and logging',
      'Production deployment strategies'
    ]
  },
  {
    id: 6,
    title: 'Mobile App Development',
    description: 'Build professional iOS and Android apps using React Native and native frameworks.',
    level: 'intermediate',
    weeks: 12,
    students: '450+',
    price: '₹16k',
    image: 'images/gallery3.jpg',
    rating: 5,
    reviews: 198,
    tags: ['React Native', 'iOS', 'Android'],
    details: [
      'React Native fundamentals',
      'Native iOS development (Swift)',
      'Native Android development (Kotlin)',
      'State management and navigation',
      'API integration and backend',
      'App store deployment',
      'Performance optimization'
    ]
  }
];

let currentFilter = 'all';
let searchTerm = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  attachEventListeners();
});

// Render courses
function renderCourses() {
  const grid = document.getElementById('coursesGrid');
  const noResults = document.getElementById('noResultsModern');
  
  if (!grid) return;

  let filtered = coursesData;

  // Apply level filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(course => course.level === currentFilter);
  }

  // Apply search
  if (searchTerm) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Show/hide no results message
  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  grid.innerHTML = filtered.map(course => `
    <div class="course-card-modern" data-course-id="${course.id}" data-level="${course.level}">
      <img src="${course.image}" alt="${course.title}" loading="lazy">
      
      <div class="course-card-header">
        <span class="course-level-badge ${course.level}">${course.level.charAt(0).toUpperCase() + course.level.slice(1)}</span>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        
        <div class="course-meta">
          <div class="course-meta-item">
            <span class="course-meta-value">${course.weeks}</span>
            <span class="course-meta-label">Weeks</span>
          </div>
          <div class="course-meta-item">
            <span class="course-meta-value">${course.students}</span>
            <span class="course-meta-label">Students</span>
          </div>
          <div class="course-meta-item">
            <span class="course-meta-value">${course.price}</span>
            <span class="course-meta-label">Price</span>
          </div>
        </div>
      </div>

      <div class="course-card-footer">
        <button class="details-btn-modern" onclick="showCourseDetails(${course.id})">Details</button>
        <button class="enroll-btn-modern" onclick="enrollCourse(${course.id})">Enroll Now</button>
      </div>
    </div>
  `).join('');

  // Add animation
  grid.querySelectorAll('.course-card-modern').forEach((card, index) => {
    card.style.animation = `scaleIn 0.6s ease-out ${index * 0.1}s both`;
  });
}

// Attach event listeners
function attachEventListeners() {
  // Search
  const searchInput = document.getElementById('courseSearchModern');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderCourses();
    });
  }

  // Filters
  const filterButtons = document.querySelectorAll('.filter-btn-modern');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.closest('.filter-btn-modern').classList.add('active');
      currentFilter = e.target.closest('.filter-btn-modern').dataset.filter;
      renderCourses();
    });
  });
}

// Show course details (modal or expand)
function showCourseDetails(courseId) {
  const course = coursesData.find(c => c.id === courseId);
  if (!course) return;

  alert(`
Course: ${course.title}

What You'll Learn:
${course.details.map(d => '✓ ' + d).join('\n')}

Rating: ${'⭐'.repeat(course.rating)} (${course.reviews} reviews)
  `);
}

// Enroll button action
function enrollCourse(courseId) {
  const course = coursesData.find(c => c.id === courseId);
  // Redirect to admission page with course ID
  window.location.href = `admission.html?courseId=${courseId}`;
}
