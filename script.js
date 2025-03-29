// Resume Builder Application
class ResumeBuilder {
  constructor() {
    this.resumeData = {
      personal: {
        name: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        github: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: []
    };
    this.currentTemplate = 'professional';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderFormSections();
    this.setupTemplateSwitcher();
    this.addSectionItem('education');
    this.addSectionItem('experience');
    this.addSectionItem('skills');
  }

  setupEventListeners() {
    document.addEventListener('input', (e) => {
      if (e.target.matches('[data-resume-field]')) {
        this.handleFormInput(e.target);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-add-section]')) {
        this.addSectionItem(e.target.dataset.addSection);
      }
      if (e.target.matches('[data-remove-item]')) {
        this.removeSectionItem(
          e.target.dataset.section,
          parseInt(e.target.dataset.index)
        );
      }
      if (e.target.matches('[data-template]')) {
        this.switchTemplate(e.target.dataset.template);
      }
      if (e.target.matches('[data-export-pdf]')) {
        this.exportPDF();
      }
    });
  }

  handleFormInput(input) {
    const field = input.dataset.resumeField;
    const section = input.dataset.section;
    const index = input.dataset.index || 0;

    if (section === 'personal') {
      this.resumeData.personal[field] = input.value;
    } else if (['education', 'experience', 'skills', 'projects'].includes(section)) {
      if (!this.resumeData[section][index]) {
        this.resumeData[section][index] = {};
      }
      this.resumeData[section][index][field] = input.value;
    }

    this.renderPreview();
  }

  renderFormSections() {
    const formSections = document.getElementById('form-sections');
    
    // Personal Information Section
    formSections.innerHTML += `
      <div class="resume-section bg-gray-50 p-4 rounded-lg">
        <h3 class="font-medium text-lg mb-3 flex items-center">
          <i class="fas fa-user mr-2 text-blue-500"></i>
          Personal Information
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
            <input type="text" data-section="personal" data-resume-field="name" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input type="email" data-section="personal" data-resume-field="email" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" data-section="personal" data-resume-field="phone"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" data-section="personal" data-resume-field="address"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input type="url" data-section="personal" data-resume-field="linkedin"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input type="url" data-section="personal" data-resume-field="github"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>
    `;

    // Education Section
    formSections.innerHTML += this.createDynamicSection('education', 'Education', 'graduation-cap');
    // Experience Section
    formSections.innerHTML += this.createDynamicSection('experience', 'Work Experience', 'briefcase');
    // Skills Section
    formSections.innerHTML += this.createDynamicSection('skills', 'Skills', 'code');
    // Projects Section
    formSections.innerHTML += this.createDynamicSection('projects', 'Projects', 'project-diagram');
  }

  createDynamicSection(section, title, icon) {
    return `
      <div class="resume-section bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-medium text-lg flex items-center">
            <i class="fas fa-${icon} mr-2 text-blue-500"></i>
            ${title}
          </h3>
          <button class="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  data-add-section="${section}">
            <i class="fas fa-plus mr-1"></i> Add
          </button>
        </div>
        <div id="${section}-container" class="space-y-4">
          <!-- Items will be added dynamically -->
        </div>
      </div>
    `;
  }

  addSectionItem(section) {
    const container = document.getElementById(`${section}-container`);
    const index = this.resumeData[section].length;
    this.resumeData[section].push({});

    let itemHTML = '';
    switch(section) {
      case 'education':
        itemHTML = this.createEducationItem(index);
        break;
      case 'experience':
        itemHTML = this.createExperienceItem(index);
        break;
      case 'skills':
        itemHTML = this.createSkillItem(index);
        break;
      case 'projects':
        itemHTML = this.createProjectItem(index);
        break;
    }

    container.insertAdjacentHTML('beforeend', itemHTML);
    this.renderPreview();
  }

  createEducationItem(index) {
    return `
      <div class="resume-item bg-white p-4 rounded border border-gray-200 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500" 
                data-remove-item data-section="education" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Degree*</label>
            <input type="text" data-section="education" data-resume-field="degree" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Institution*</label>
            <input type="text" data-section="education" data-resume-field="institution" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
            <input type="month" data-section="education" data-resume-field="startDate" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date (or expected)</label>
            <input type="month" data-section="education" data-resume-field="endDate" data-index="${index}"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea data-section="education" data-resume-field="description" data-index="${index}"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2"></textarea>
          </div>
        </div>
      </div>
    `;
  }

  createExperienceItem(index) {
    return `
      <div class="resume-item bg-white p-4 rounded border border-gray-200 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500" 
                data-remove-item data-section="experience" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
            <input type="text" data-section="experience" data-resume-field="title" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Company*</label>
            <input type="text" data-section="experience" data-resume-field="company" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
            <input type="month" data-section="experience" data-resume-field="startDate" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date (or present)</label>
            <input type="month" data-section="experience" data-resume-field="endDate" data-index="${index}"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea data-section="experience" data-resume-field="description" data-index="${index}" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
          </div>
        </div>
      </div>
    `;
  }

  createSkillItem(index) {
    return `
      <div class="resume-item bg-white p-4 rounded border border-gray-200 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500" 
                data-remove-item data-section="skills" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Skill Name*</label>
            <input type="text" data-section="skills" data-resume-field="name" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Proficiency (1-10)*</label>
            <input type="number" min="1" max="10" data-section="skills" data-resume-field="proficiency" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>
    `;
  }

  createProjectItem(index) {
    return `
      <div class="resume-item bg-white p-4 rounded border border-gray-200 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500" 
                data-remove-item data-section="projects" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
            <input type="text" data-section="projects" data-resume-field="name" data-index="${index}" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
            <input type="text" data-section="projects" data-resume-field="technologies" data-index="${index}"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea data-section="projects" data-resume-field="description" data-index="${index}" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
            <input type="url" data-section="projects" data-resume-field="url" data-index="${index}"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>
    `;
  }

  removeSectionItem(section, index) {
    this.resumeData[section].splice(index, 1);
    this.renderFormSections();
    this.renderPreview();
  }

  setupTemplateSwitcher() {
    const templateButtons = document.querySelectorAll('[data-template]');
    templateButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.switchTemplate(button.dataset.template);
      });
    });
  }

  switchTemplate(template) {
    this.currentTemplate = template;
    this.renderPreview();
  }

  renderPreview() {
    const preview = document.getElementById('resume-preview');
    if (!this.resumeData.personal.name) {
      preview.innerHTML = `
        <div class="text-center text-gray-400 py-20">
          <i class="fas fa-file-alt text-4xl mb-2"></i>
          <p>Your resume will appear here</p>
        </div>
      `;
      return;
    }

    let templateHTML = '';
    switch(this.currentTemplate) {
      case 'professional':
        templateHTML = this.renderProfessionalTemplate();
        break;
      case 'modern':
        templateHTML = this.renderModernTemplate();
        break;
      default:
        templateHTML = this.renderProfessionalTemplate();
    }

    preview.innerHTML = templateHTML;
  }

  renderProfessionalTemplate() {
    const { personal, education, experience, skills, projects } = this.resumeData;
    return `
      <div class="template-professional p-6">
        <header class="mb-6 border-b pb-4">
          <h1 class="text-3xl font-bold">${personal.name || 'Your Name'}</h1>
          <div class="flex flex-wrap gap-x-4 text-sm text-gray-600">
            ${personal.email ? `<span><i class="fas fa-envelope mr-1"></i> ${personal.email}</span>` : ''}
            ${personal.phone ? `<span><i class="fas fa-phone mr-1"></i> ${personal.phone}</span>` : ''}
            ${personal.linkedin ? `<span><i class="fab fa-linkedin mr-1"></i> ${personal.linkedin.replace('https://', '')}</span>` : ''}
            ${personal.github ? `<span><i class="fab fa-github mr-1"></i> ${personal.github.replace('https://', '')}</span>` : ''}
          </div>
        </header>

        ${education.length > 0 ? `
        <section class="mb-6">
          <h2 class="text-xl font-bold border-b pb-1 mb-3">Education</h2>
          ${education.map(edu => `
            <div class="mb-4">
              <div class="flex justify-between">
                <h3 class="font-bold">${edu.degree || 'Degree'}</h3>
                <div class="text-gray-600">
                  ${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}
                </div>
              </div>
              <div class="text-gray-600 italic">${edu.institution || 'Institution'}</div>
              ${edu.description ? `<p class="mt-1">${edu.description}</p>` : ''}
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${experience.length > 0 ? `
        <section class="mb-6">
          <h2 class="text-xl font-bold border-b pb-1 mb-3">Work Experience</h2>
          ${experience.map(exp => `
            <div class="mb-4">
              <div class="flex justify-between">
                <h3 class="font-bold">${exp.title || 'Position'}</h3>
                <div class="text-gray-600">
                  ${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}
                </div>
              </div>
              <div class="text-gray-600 italic">${exp.company || 'Company'}</div>
              ${exp.description ? `<p class="mt-1">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </section>
        ` : ''}

        ${skills.length > 0 ? `
        <section class="mb-6">
          <h2 class="text-xl font-bold border-b pb-1 mb-3">Skills</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${skills.map(skill => `
              <div>
                <div class="flex justify-between mb-1">
                  <span>${skill.name || 'Skill'}</span>
                  <span>${skill.proficiency ? `${skill.proficiency}/10` : ''}</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-level" style="width: ${(skill.proficiency || 5) * 10}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        ${projects.length > 0 ? `
        <section class="mb-6">
          <h2 class="text-xl font-bold border-b pb-1 mb-3">Projects</h2>
          ${projects.map(project => `
            <div class="mb-4">
              <h3 class="font-bold">${project.name || 'Project Name'}</h3>
              ${project.technologies ? `<div class="text-gray-600 italic">${project.technologies}</div>` : ''}
              ${project.description ? `<p class="mt-1">${project.description}</p>` : ''}
              ${project.url ? `<a href="${project.url}" class="text-blue-600 text-sm">View Project</a>` : ''}
            </div>
          `).join('')}
        </section>
        ` : ''}
      </div>
    `;
  }

  renderModernTemplate() {
    const { personal, education, experience, skills, projects } = this.resumeData;
    return `
      <div class="template-modern p-6 bg-gray-50">
        <header class="mb-8 flex items-start">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-800">${personal.name || 'Your Name'}</h1>
            <div class="text-gray-600">${personal.email || ''}</div>
          </div>
          <div class="text-right">
            ${personal.phone ? `<div class="text-gray-600">${personal.phone}</div>` : ''}
            ${personal.linkedin ? `<div class="text-blue-600"><a href="${personal.linkedin}">LinkedIn</a></div>` : ''}
            ${personal.github ? `<div class="text-blue-600"><a href="${personal.github}">GitHub</a></div>` : ''}
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2">
            ${experience.length > 0 ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-1 mb-4">EXPERIENCE</h2>
              ${experience.map(exp => `
                <div class="mb-6">
                  <div class="flex justify-between items-baseline">
                    <h3 class="font-bold text-lg">${exp.title || 'Position'}</h3>
                    <div class="text-gray-600 text-sm">
                      ${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div class="text-gray-600 italic">${exp.company || 'Company'}</div>
                  ${exp.description ? `<p class="mt-2 text-gray-700">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </section>
            ` : ''}

            ${education.length > 0 ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-1 mb-4">EDUCATION</h2>
              ${education.map(edu => `
                <div class="mb-6">
                  <div class="flex justify-between items-baseline">
                    <h3 class="font-bold text-lg">${edu.degree || 'Degree'}</h3>
                    <div class="text-gray-600 text-sm">
                      ${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}
                    </div>
                  </div>
                  <div class="text-gray-600 italic">${edu.institution || 'Institution'}</div>
                  ${edu.description ? `<p class="mt-2 text-gray-700">${edu.description}</p>` : ''}
                </div>
              `).join('')}
            </section>
            ` : ''}
          </div>

          <div>
            ${skills.length > 0 ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-1 mb-4">SKILLS</h2>
              <div class="space-y-3">
                ${skills.map(skill => `
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span>${skill.name || 'Skill'}</span>
                      <span>${skill.proficiency ? `${skill.proficiency}/10` : ''}</span>
                    </div>
                    <div class="skill-bar">
                      <div class="skill-level" style="width: ${(skill.proficiency || 5) * 10}%"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
            ` : ''}

            ${projects.length > 0 ? `
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-1 mb-4">PROJECTS</h2>
              <div class="space-y-4">
                ${projects.map(project => `
                  <div>
                    <h3 class="font-bold">${project.name || 'Project Name'}</h3>
                    ${project.technologies ? `<div class="text-gray-600 text-sm italic">${project.technologies}</div>` : ''}
                    ${project.description ? `<p class="mt-1 text-sm text-gray-700">${project.description}</p>` : ''}
                    ${project.url ? `<a href="${project.url}" class="text-blue-600 text-sm">View Project</a>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  exportPDF() {
    // This would use jsPDF in a real implementation
    alert('In a complete implementation, this would generate a PDF. For now, use your browser\'s print function (Ctrl+P) and select "Save as PDF".');
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new ResumeBuilder();
});