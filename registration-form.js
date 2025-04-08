document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const sameAddressCheckbox = document.getElementById('sameAddress');
    const registeredAddressSection = document.getElementById('registeredAddressSection');

    // Function to generate a random 11-digit PESEL number
    function generateRandomPesel() {
        let pesel = '';
        for (let i = 0; i < 11; i++) {
            pesel += Math.floor(Math.random() * 10);
        }
        return pesel;
    }

    // Add a function to prepopulate form fields with dummy data
    function prepopulateFormWithDummyData() {
        // Student data
        document.getElementById('firstName').value = 'Jan Maria';
        document.getElementById('lastName').value = 'Kowalski';
        document.getElementById('pesel').value = generateRandomPesel();
        document.getElementById('grade').value = '3';

        // Set a date of birth (6 years ago from current date)
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 9);
        document.getElementById('birthDate').value = birthDate.toISOString().split('T')[0];

        document.getElementById('birthPlace').value = 'Warszawa';

        // Residence address
        document.getElementById('resStreetWithNumber').value = 'Marszałkowska 123/45';
        document.getElementById('resPostalCode').value = '00-950';
        document.getElementById('resCity').value = 'Warszawa';

        // Registered address
        document.getElementById('regStreetWithNumber').value = 'Marszałkowska 123/45';
        document.getElementById('regPostalCode').value = '00-950';
        document.getElementById('regCity').value = 'Warszawa';

        // Schools
        document.getElementById('currentSchoolName').value = 'Szkoła Podstawowa nr 123 im. Jana Kowalskiego';
        document.getElementById('currentSchoolAddress').value = 'ul. Szkolna 10, 00-950 Warszawa';
        document.getElementById('districtSchoolName').value = 'Szkoła Podstawowa nr 456 im. Marii Nowak';
        document.getElementById('districtSchoolAddress').value = 'ul. Rejonowa 20, 00-950 Warszawa';
        document.getElementById('districtSchoolEmail').value = 'sekretariat@sp456.edu.pl';

        // Mother data
        document.getElementById('motherFirstName').value = 'Anna';
        document.getElementById('motherLastName').value = 'Kowalska';
        document.getElementById('motherPhone').value = '500100200';
        document.getElementById('motherEmail').value = 'anna.kowalska@example.com';
        document.getElementById('motherIdSeries').value = 'ABC';
        document.getElementById('motherIdNumber').value = '123456';
        document.getElementById('motherStreetWithNumber').value = 'Marszałkowska 1';
        document.getElementById('motherPostalCode').value = '00-950';
        document.getElementById('motherCity').value = 'Warszawa';

        // Father data
        document.getElementById('fatherFirstName').value = 'Tomasz';
        document.getElementById('fatherLastName').value = 'Kowalski';
        document.getElementById('fatherPhone').value = '600200300';
        document.getElementById('fatherEmail').value = 'tomasz.kowalski@example.com';
        document.getElementById('fatherIdSeries').value = 'DEF';
        document.getElementById('fatherIdNumber').value = '654321';
        document.getElementById('fatherStreetWithNumber').value = 'Marszałkowska 12';
        document.getElementById('fatherPostalCode').value = '00-950';
        document.getElementById('fatherCity').value = 'Warszawa';

        // Check the agreement checkbox
        document.getElementById('agreement').checked = true;
    }

    // Call the function to prepopulate form with dummy data
    prepopulateFormWithDummyData();


    // Restrict input to digits only for PESEL field, max 11 chars
    document.getElementById('pesel').addEventListener('input', function (e) {
        // Replace any non-digit characters with empty string
        let inputValue = e.target.value.replace(/[^0-9]/g, '');

        // Ensure we don't exceed 11 characters
        if (inputValue.length > 11) {
            inputValue = inputValue.slice(0, 11);
        }

        // Update the input value with digits only
        e.target.value = inputValue;

        // Real-time validation feedback
        const peselFeedback = document.getElementById('pesel-feedback');

        if (inputValue && inputValue.length !== 11) {
            // If there's any input but it's not 11 digits, show error
            if (!peselFeedback) {
                // Create feedback element if it doesn't exist
                const feedbackEl = document.createElement('div');
                feedbackEl.id = 'pesel-feedback';
                feedbackEl.className = 'invalid-feedback d-block';
                feedbackEl.textContent = 'PESEL musi składać się dokładnie z 11 cyfr';
                e.target.classList.add('is-invalid');
                e.target.parentNode.appendChild(feedbackEl);
            }
        } else if (inputValue.length === 11) {
            // Valid PESEL (11 digits)
            e.target.classList.remove('is-invalid');
            e.target.classList.add('is-valid');
            if (peselFeedback) {
                peselFeedback.remove();
            }
        } else if (peselFeedback) {
            // Remove feedback if input is empty
            peselFeedback.remove();
            e.target.classList.remove('is-invalid');
            e.target.classList.remove('is-valid');
        }
    });

    /**
     * Reusable function to format postal code in XX-XXX format
     * @param {string} value - The input value to format
     * @returns {string} - Formatted postal code
     */
    function formatPostalCode(value) {
        // Remove all non-digit characters except hyphen
        let cleaned = value.replace(/[^\d-]/g, '');

        // Handle case where user entered hyphen manually
        if (cleaned.length > 2 && cleaned.charAt(2) === '-') {
            // Keep the manually entered hyphen and continue formatting
            const firstPart = cleaned.substring(0, 3); // Keep XX-
            const secondPart = cleaned.substring(3).replace(/\D/g, '').substring(0, 3); // Get up to 3 digits after hyphen
            return firstPart + secondPart;
        } else {
            // No manual hyphen - format automatically
            const digits = cleaned.replace(/\D/g, '');

            // Limit to 5 digits total
            const limitedDigits = digits.substring(0, 5);

            // Format as XX-XXX if we have 2 or more digits
            if (limitedDigits.length > 2) {
                return limitedDigits.substring(0, 2) + '-' + limitedDigits.substring(2);
            } else {
                return limitedDigits;
            }
        }
    }

    /**
     * Sets up a "same address" checkbox to copy address fields from source to target
     * @param {string} checkboxId - ID of the checkbox element
     * @param {string} targetSectionId - ID of the section containing target fields
     * @param {Object} fieldMap - Mapping of source field IDs to target field IDs
     */
    function setupAddressCopyFeature(checkboxId, targetSectionId, fieldMap) {
        const checkbox = document.getElementById(checkboxId);
        const targetSection = document.getElementById(targetSectionId);

        if (!checkbox || !targetSection) return;

        // Handle checkbox change event
        checkbox.addEventListener('change', function () {
            const isChecked = this.checked;

            // For each field in the mapping
            Object.entries(fieldMap).forEach(([sourceId, targetId]) => {
                const sourceElement = document.getElementById(sourceId);
                const targetElement = document.getElementById(targetId);

                if (sourceElement && targetElement) {
                    // Copy and format value if checkbox is checked
                    if (isChecked) {
                        // Special handling for postal code fields
                        if (targetId.includes('PostalCode')) {
                            targetElement.value = formatPostalCode(sourceElement.value);
                        } else {
                            targetElement.value = sourceElement.value;
                        }

                        // Disable target fields
                        targetElement.disabled = true;
                    } else {
                        // Enable target fields when unchecked
                        targetElement.disabled = false;
                    }
                }
            });

            // Toggle visual class
            if (isChecked) {
                targetSection.classList.add('auto-filled');
            } else {
                targetSection.classList.remove('auto-filled');
            }
        });

        // Set up source field input listeners to update target fields when changed
        const sourceFields = Object.keys(fieldMap);
        sourceFields.forEach(sourceId => {
            document.getElementById(sourceId)?.addEventListener('input', function () {
                if (checkbox.checked) {
                    const targetId = fieldMap[sourceId];
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        // Special handling for postal code
                        if (targetId.includes('PostalCode')) {
                            targetElement.value = formatPostalCode(this.value);
                        } else {
                            targetElement.value = this.value;
                        }
                    }
                }
            });
        });
    }

    // Set up address copying features

    // 1. Registered address copy from residence address
    setupAddressCopyFeature('sameAddress', 'registeredAddressSection', {
        'resStreetWithNumber': 'regStreetWithNumber',
        'resPostalCode': 'regPostalCode',
        'resCity': 'regCity'
    });

    // 2. Mother's address copy from residence address
    setupAddressCopyFeature('motherSameAddress', 'motherAddressSection', {
        'resStreetWithNumber': 'motherStreetWithNumber',
        'resPostalCode': 'motherPostalCode',
        'resCity': 'motherCity'
    });

    // 3. Father's address copy from residence address
    setupAddressCopyFeature('fatherSameAddress', 'fatherAddressSection', {
        'resStreetWithNumber': 'fatherStreetWithNumber',
        'resPostalCode': 'fatherPostalCode',
        'resCity': 'fatherCity'
    });

    // Helper function to reset address sections after form submission or when needed
    function resetAddressSection(checkboxId, sectionId, fieldIds) {
        document.getElementById(checkboxId).checked = false;
        document.getElementById(sectionId).classList.remove('auto-filled');

        fieldIds.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.disabled = false;
            }
        });
    }

    // Form validation and submission
    registrationForm.addEventListener('submit', function (event) {
        // Prevent default submission
        event.preventDefault();

        // Only use our custom validation
        if (!validateForm()) {
            return false;
        }

        // Temporarily re-enable any disabled fields to ensure their data is included in the form submission
        const disabledFields = registrationForm.querySelectorAll('input:disabled, select:disabled');
        disabledFields.forEach(field => {
            field.disabled = false;
        });

        // If form is valid, collect the data
        const formData = new FormData(registrationForm);
        
        // Format the birth date value to DD.MM.YYYY before submission
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput && birthDateInput.value) {
            // Get the ISO formatted date (YYYY-MM-DD)
            const isoDate = birthDateInput.value;
            
            // Parse the date components
            const [year, month, day] = isoDate.split('-');
            
            // Create formatted date (DD.MM.YYYY)
            const formattedDate = `${day}.${month}.${year}`;
            
            // Replace the value in formData
            formData.set('birthDate', formattedDate);
        }

        // Re-disable the fields that were previously disabled
        disabledFields.forEach(field => {
            field.disabled = true;
        });

        // URL for Google Sheets script
        const sheetScriptURL = "https://script.google.com/macros/s/AKfycbwZJBpP5An4M0MdDYPeGopx7dvk-5-NerMa-9-dRg1kab85Zz9gU9sUIP6Qb99pnx5N/exec";

        // Show loading indicator
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Wysyłanie...';

        // Send data to Google Sheets
        fetch(sheetScriptURL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        })
            .then(response => {
                // Google Apps Script returns success via HTTP code, but may have application-level errors
                // We're converting the response to text to handle both success and Google Apps Script errors
                return response.text().then(text => {
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    }
                    return text;
                });
            })
            .then(data => {
                console.log('Form data submitted successfully');

                // Display confirmation message
                showConfirmationMessage();

                // Reset form after successful submission
                registrationForm.reset();

                // Reset address sections
                resetAddressSection('sameAddress', 'registeredAddressSection', [
                    'regStreetWithNumber', 'regPostalCode', 'regCity'
                ]);

                resetAddressSection('motherSameAddress', 'motherAddressSection', [
                    'motherStreetWithNumber', 'motherPostalCode', 'motherCity'
                ]);

                resetAddressSection('fatherSameAddress', 'fatherAddressSection', [
                    'fatherStreetWithNumber', 'fatherPostalCode', 'fatherCity'
                ]);
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.');
            })
            .finally(() => {
                // Reset submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });

    // Validate form fields
    function validateForm() {
        let isValid = true;

        // Clear previous validation indicators
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
            feedback.remove();
        });

        // Helper function to mark a field as invalid with feedback
        function markInvalid(field, message) {
            field.classList.add('is-invalid');

            // Create feedback element if it doesn't exist
            let feedbackElement = field.nextElementSibling;
            if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement = document.createElement('div');
                feedbackElement.className = 'invalid-feedback';
                field.parentNode.appendChild(feedbackElement);
            }

            feedbackElement.textContent = message;
            feedbackElement.style.display = 'block';

            isValid = false;

            // Scroll to the first invalid field
            if (isValid === false && field === document.querySelector('.is-invalid')) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Utility function for field validation with common patterns
        function validateField(id, options = {}) {
            const field = document.getElementById(id);
            if (!field) return;

            const value = field.value.trim();

            // Required field validation
            if (options.required && !value) {
                markInvalid(field, options.requiredMessage || 'To pole jest wymagane');
                return false;
            }

            // Pattern validation (if field has value)
            if (value && options.pattern && !options.pattern.test(value)) {
                markInvalid(field, options.patternMessage || 'Wartość nie spełnia wymagań');
                return false;
            }

            return true;
        }

        // Validate PESEL (11 digits)
        validateField('pesel', {
            required: true,
            pattern: /^\d{11}$/,
            requiredMessage: 'Proszę podać numer PESEL',
            patternMessage: 'PESEL musi składać się dokładnie z 11 cyfr'
        });

        // Validate name fields
        validateField('firstName', { required: true, requiredMessage: 'Proszę podać imię ucznia' });
        validateField('lastName', { required: true, requiredMessage: 'Proszę podać nazwisko ucznia' });
        validateField('birthDate', { required: true, requiredMessage: 'Proszę podać datę urodzenia' });
        validateField('birthPlace', { required: true, requiredMessage: 'Proszę podać miejsce urodzenia' });

        // Validate address fields
        validateField('resStreetWithNumber', { required: true, requiredMessage: 'Proszę podać ulicę wraz z numerem domu' });
        validateField('resPostalCode', {
            required: true,
            pattern: /^\d{2}-\d{3}$/,
            requiredMessage: 'Proszę podać kod pocztowy',
            patternMessage: 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)'
        });
        validateField('resCity', { required: true, requiredMessage: 'Proszę podać miejscowość' });

        // Validate registered address fields if "same address" is not checked
        const sameAddressCheckbox = document.getElementById('sameAddress');
        if (!sameAddressCheckbox.checked) {
            validateField('regStreetWithNumber', {
                required: true,
                requiredMessage: 'Proszę podać ulicę wraz z numerem domu w adresie zameldowania'
            });
            validateField('regPostalCode', {
                required: true,
                pattern: /^\d{2}-\d{3}$/,
                requiredMessage: 'Proszę podać kod pocztowy',
                patternMessage: 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)'
            });
            validateField('regCity', { required: true, requiredMessage: 'Proszę podać miejscowość' });
        }

        // Validate school information
        validateField('currentSchoolName', {
            required: true,
            requiredMessage: 'Proszę podać nazwę obecnej szkoły ucznia'
        });
        validateField('currentSchoolAddress', {
            required: true,
            requiredMessage: 'Proszę podać adres obecnej szkoły ucznia'
        });
        validateField('districtSchoolName', {
            required: true,
            requiredMessage: 'Proszę podać nazwę szkoły rejonowej'
        });
        validateField('districtSchoolAddress', {
            required: true,
            requiredMessage: 'Proszę podać adres szkoły rejonowej'
        });
        validateField('districtSchoolEmail', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            requiredMessage: 'Proszę podać adres e-mail szkoły rejonowej',
            patternMessage: 'Proszę podać prawidłowy adres e-mail szkoły rejonowej'
        });

        // Validate mother's information
        validateField('motherFirstName', { required: true, requiredMessage: 'Proszę podać imię matki' });
        validateField('motherLastName', { required: true, requiredMessage: 'Proszę podać nazwisko matki' });
        validateField('motherPhone', {
            required: true,
            pattern: /^\d{9}$/,
            requiredMessage: 'Proszę podać numer telefonu matki',
            patternMessage: 'Numer telefonu powinien składać się z 9 cyfr bez myślników i spacji'
        });
        validateField('motherEmail', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            requiredMessage: 'Proszę podać adres e-mail matki',
            patternMessage: 'Proszę podać prawidłowy adres e-mail matki'
        });

        // Validate mother's address if checkbox is not checked
        const motherSameAddressCheckbox = document.getElementById('motherSameAddress');
        if (!motherSameAddressCheckbox.checked) {
            validateField('motherStreetWithNumber', {
                required: true,
                requiredMessage: 'Proszę podać ulicę wraz z numerem domu mamy'
            });
            validateField('motherPostalCode', {
                required: true,
                pattern: /^\d{2}-\d{3}$/,
                requiredMessage: 'Proszę podać kod pocztowy',
                patternMessage: 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)'
            });
            validateField('motherCity', { required: true, requiredMessage: 'Proszę podać miejscowość' });
        }

        // Validate father's information
        validateField('fatherFirstName', { required: true, requiredMessage: 'Proszę podać imię ojca' });
        validateField('fatherLastName', { required: true, requiredMessage: 'Proszę podać nazwisko ojca' });
        validateField('fatherPhone', {
            required: true,
            pattern: /^\d{9}$/,
            requiredMessage: 'Proszę podać numer telefonu ojca',
            patternMessage: 'Numer telefonu powinien składać się z 9 cyfr bez myślników i spacji'
        });
        validateField('fatherEmail', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            requiredMessage: 'Proszę podać adres e-mail ojca',
            patternMessage: 'Proszę podać prawidłowy adres e-mail ojca'
        });

        // Validate father's address if checkbox is not checked
        const fatherSameAddressCheckbox = document.getElementById('fatherSameAddress');
        if (!fatherSameAddressCheckbox.checked) {
            validateField('fatherStreetWithNumber', {
                required: true,
                requiredMessage: 'Proszę podać ulicę wraz z numerem domu ojca'
            });
            validateField('fatherPostalCode', {
                required: true,
                pattern: /^\d{2}-\d{3}$/,
                requiredMessage: 'Proszę podać kod pocztowy',
                patternMessage: 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)'
            });
            validateField('fatherCity', { required: true, requiredMessage: 'Proszę podać miejscowość' });
        }

        // Validate if agreement is checked
        const agreement = document.getElementById('agreement');
        if (!agreement.checked) {
            // Special case for checkbox
            agreement.classList.add('is-invalid');
            let agreementContainer = agreement.closest('.form-check');
            let feedbackElement = agreementContainer.querySelector('.invalid-feedback');

            if (!feedbackElement) {
                feedbackElement = document.createElement('div');
                feedbackElement.className = 'invalid-feedback';
                agreementContainer.appendChild(feedbackElement);
            }

            feedbackElement.textContent = 'Musisz wyrazić zgodę na przetwarzanie danych osobowych';
            feedbackElement.style.display = 'block';
            isValid = false;
        }

        return isValid;
    }

    // Restrict input to digits only for phone number fields
    ['motherPhone', 'fatherPhone'].forEach(function (fieldId) {
        document.getElementById(fieldId).addEventListener('input', function (e) {
            // Remove any non-digit characters
            let inputValue = e.target.value.replace(/[^0-9]/g, '');

            // Limit to 9 digits
            if (inputValue.length > 9) {
                inputValue = inputValue.slice(0, 9);
            }

            // Update the input value
            e.target.value = inputValue;
        });
    });

    // Format ID series inputs to uppercase letters only
    ['motherIdSeries', 'fatherIdSeries'].forEach(function (fieldId) {
        document.getElementById(fieldId).addEventListener('input', function (e) {
            // Remove any non-letter characters and convert to uppercase
            let inputValue = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();

            // Limit to 3 characters
            if (inputValue.length > 3) {
                inputValue = inputValue.slice(0, 3);
            }

            // Update the input value
            e.target.value = inputValue;
        });
    });

    // Format ID number inputs to digits only
    ['motherIdNumber', 'fatherIdNumber'].forEach(function (fieldId) {
        document.getElementById(fieldId).addEventListener('input', function (e) {
            // Remove any non-digit characters
            let inputValue = e.target.value.replace(/[^0-9]/g, '');

            // Limit to 6 characters
            if (inputValue.length > 6) {
                inputValue = inputValue.slice(0, 6);
            }

            // Update the input value
            e.target.value = inputValue;
        });
    });

    // Auto-format postal code inputs as user types
    ['resPostalCode', 'regPostalCode', 'motherPostalCode', 'fatherPostalCode'].forEach(function (fieldId) {
        document.getElementById(fieldId).addEventListener('input', function (e) {
            e.target.value = formatPostalCode(e.target.value);
        });
    });

    // Display confirmation message after form submission
    function showConfirmationMessage() {
        // Create a modal with bootstrap if available
        if (typeof bootstrap !== 'undefined') {
            // Check if there's already a confirmation modal
            let confirmationModal = document.getElementById('confirmationModal');

            if (confirmationModal) {
                // Remove existing modal
                confirmationModal.remove();
            }

            // Create modal HTML with generic thank you message
            const modalHTML = `
                <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-success text-white">
                                <h5 class="modal-title" id="confirmationModalLabel">Potwierdzenie Rejestracji</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Dziękujemy za wypełnienie formularza rejestracyjnego!</p>
                                <p>Zgłoszenie zostało przyjęte.</p>
                                <p>Skontaktujemy się z Państwem w najbliższym czasie.</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zamknij</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            modal.show();
        } else {
            // Fallback if Bootstrap is not available
            alert(`Dziękujemy za wypełnienie formularza rejestracyjnego!
Zgłoszenie zostało przyjęte.
Skontaktujemy się z Państwem w najbliższym czasie.`);
        }
    }
});