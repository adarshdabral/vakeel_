document.addEventListener('DOMContentLoaded', function() {
    // Toggle lawyer fields in registration form
    const isLawyerCheckbox = document.getElementById('isLawyer');
    const lawyerFields = document.getElementById('lawyerFields');

    if (isLawyerCheckbox && lawyerFields) {
        isLawyerCheckbox.addEventListener('change', function() {
            lawyerFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(this)) {
                event.preventDefault();
            }
        });
    });

    // Lawyer search functionality
    const searchForm = document.getElementById('searchLawyersForm');
    const searchResults = document.getElementById('searchResults');

    if (searchForm && searchResults) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const niche = document.getElementById('searchNiche').value;
            searchLawyers(niche);
        });
    }
});

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else {
            clearError(input);
        }
    });

    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !isValidEmail(emailInput.value)) {
        isValid = false;
        showError(emailInput, 'Please enter a valid email address');
    }

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    input.classList.add('is-invalid');
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if (error) {
        formGroup.removeChild(error);
    }
    input.classList.remove('is-invalid');
}

function searchLawyers(niche) {
    fetch(`/dashboard/search-lawyers?niche=${encodeURIComponent(niche)}`)
        .then(response => response.json())
        .then(data => {
            displayLawyerResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            searchResults.innerHTML = '<p>An error occurred while searching for lawyers.</p>';
        });
}

function displayLawyerResults(lawyers) {
    if (lawyers.length === 0) {
        searchResults.innerHTML = '<p>No lawyers found for this niche.</p>';
        return;
    }

    let html = '<ul>';
    lawyers.forEach(lawyer => {
        html += `
            <li>
                <h3>${lawyer.firstName} ${lawyer.lastName}</h3>
                <p>Email: ${lawyer.email}</p>
                <p>Consulting Price: $${lawyer.consultingPrice}</p>
                <p>Degree: ${lawyer.degree}</p>
            </li>
        `;
    });
    html += '</ul>';

    searchResults.innerHTML = html;
}

function sendEmail(email) {
    // This function would typically open the user's default email client
    // For demonstration purposes, we'll just log to console
    console.log(`Sending email to: ${email}`);
    alert(`Email client would open to send email to: ${email}`);
}