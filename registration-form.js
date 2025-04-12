document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    /**
     * General-purpose function to toggle section visibility based on checkbox state
     * @param {HTMLElement} checkbox - The checkbox element that controls visibility
     * @param {HTMLElement[]} sections - Array of sections to toggle visibility
     * @param {Function} [onCheck] - Optional callback when checkbox is checked
     * @param {Function} [onUncheck] - Optional callback when checkbox is unchecked
     */
    function setupCheckboxToggle(checkbox, sections, onCheck, onUncheck) {
        if (!checkbox) return;
        
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            
            // Toggle sections visibility
            sections.forEach(section => {
                if (section) {
                    section.style.display = isChecked ? 'none' : 'block';
                }
            });
            
            // Execute callbacks if provided
            if (isChecked && typeof onCheck === 'function') {
                onCheck();
            } else if (!isChecked && typeof onUncheck === 'function') {
                onUncheck();
            }
        });
    }
    
    // Constants and patterns that will be reused
    const PATTERNS = {
        POSTAL_CODE: /^\d{2}-\d{3}$/,
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE: /^[\d\s+\-()\[\]]{6,25}$/
    };
    
    // Set up event handler for the noCurrentSchool checkbox
    const noCurrentSchoolCheckbox = document.getElementById('noCurrentSchool');
    const currentSchoolSection = document.getElementById('currentSchoolSection');
    
    setupCheckboxToggle(
        noCurrentSchoolCheckbox, 
        [currentSchoolSection],
        // On check callback - clear fields
        function() {
            ['currentSchoolName', 'currentSchoolAddress'].forEach(id => {
                const field = document.getElementById(id);
                if (field) field.value = '';
            });
        }
    );

    // Set up event handler for the parent availability checkboxes
    const noMotherCheckbox = document.getElementById('noMother');
    const noFatherCheckbox = document.getElementById('noFather');
    const motherDataSection = document.getElementById('motherDataSection');
    const fatherDataSection = document.getElementById('fatherDataSection');
    const motherAddressSection = document.getElementById('motherAddressSection');
    const fatherAddressSection = document.getElementById('fatherAddressSection');
    const noMotherDisabledHint = document.getElementById('noMotherDisabledHint');
    const noFatherDisabledHint = document.getElementById('noFatherDisabledHint');
    
    // Setup parent checkbox toggle functionality
    function setupParentCheckbox(checkbox, dataSections, clearPrefix, otherCheckbox, otherHint) {
        setupCheckboxToggle(
            checkbox,
            dataSections,
            // On check callback
            function() {
                // Clear fields
                clearParentFields(clearPrefix);
                
                // Disable other checkbox (need at least one parent)
                if (otherCheckbox) {
                    otherCheckbox.disabled = true;
                    
                    // Show hint
                    if (otherHint) {
                        otherHint.classList.remove('d-none');
                    }
                }
            },
            // On uncheck callback
            function() {
                // Re-enable other checkbox
                if (otherCheckbox) {
                    otherCheckbox.disabled = false;
                    
                    // Hide hint
                    if (otherHint) {
                        otherHint.classList.add('d-none');
                    }
                }
            }
        );
    }
    
    // Setup parent checkboxes with DRY implementation
    setupParentCheckbox(
        noMotherCheckbox, 
        [motherDataSection, motherAddressSection],
        'mother',
        noFatherCheckbox,
        noFatherDisabledHint
    );
    
    setupParentCheckbox(
        noFatherCheckbox,
        [fatherDataSection, fatherAddressSection],
        'father',
        noMotherCheckbox,
        noMotherDisabledHint
    );
    
    // Helper function to clear parent fields
    function clearParentFields(parentType) {
        const fieldPrefixes = ['FirstName', 'LastName', 'Phone', 'Email', 'Id', 'StreetWithNumber', 'PostalCode', 'City'];
        
        fieldPrefixes.forEach(prefix => {
            const fieldId = parentType + prefix;
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
                field.disabled = false; // Ensure fields are not disabled
                field.classList.remove('is-invalid');
                field.classList.remove('is-valid');
            }
        });
        
        // Uncheck the same address checkbox if it exists
        const sameAddressCheckbox = document.getElementById(parentType + 'SameAddress');
        if (sameAddressCheckbox) {
            sameAddressCheckbox.checked = false;
        }
        
        // Remove auto-filled styling from parent address section
        const addressSectionId = parentType + 'AddressSection';
        const addressSection = document.getElementById(addressSectionId);
        if (addressSection) {
            addressSection.classList.remove('auto-filled');
        }
    }

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

        // Set a date of birth (age-appropriate for school registration in 2025)
        const birthDate = new Date();
        // For 3rd grade (typically 9 years old)
        birthDate.setFullYear(2025 - 9);
        document.getElementById('birthDate').value = birthDate.toISOString().split('T')[0];

        document.getElementById('birthPlace').value = 'Warszawa';

        // Residence address
        document.getElementById('resStreetWithNumber').value = 'Marszałkowska 123/45';
        document.getElementById('resPostalCode').value = '00-950';
        document.getElementById('resCity').value = 'Warszawa';
        document.getElementById('resVoivodeship').value = 'Mazowieckie';
        document.getElementById('resCounty').value = 'Warszawa';
        document.getElementById('resCommune').value = 'Warszawa';

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
        document.getElementById('motherId').value = 'ABC123456';
        document.getElementById('motherStreetWithNumber').value = 'Marszałkowska 1';
        document.getElementById('motherPostalCode').value = '00-950';
        document.getElementById('motherCity').value = 'Warszawa';

        // Father data
        document.getElementById('fatherFirstName').value = 'Tomasz';
        document.getElementById('fatherLastName').value = 'Kowalski';
        document.getElementById('fatherPhone').value = '600200300';
        document.getElementById('fatherEmail').value = 'tomasz.kowalski@example.com';
        document.getElementById('fatherId').value = 'DEF654321';
        document.getElementById('fatherStreetWithNumber').value = 'Marszałkowska 12';
        document.getElementById('fatherPostalCode').value = '00-950';
        document.getElementById('fatherCity').value = 'Warszawa';

        // Check the agreement checkbox
        document.getElementById('agreement').checked = true;
    }

    // Call the function to prepopulate form with dummy data
    prepopulateFormWithDummyData();

    /**
     * Generic function to setup input validation and formatting
     * @param {string} fieldId - ID of the field to set up
     * @param {Object} options - Configuration options
     */
    function setupInputValidation(fieldId, options) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.addEventListener('input', function(e) {
            let inputValue = e.target.value;
            
            // Apply input transformation if provided
            if (typeof options.transform === 'function') {
                inputValue = options.transform(inputValue);
                e.target.value = inputValue;
            }
            
            // Check validation if provided
            if (typeof options.validate === 'function') {
                options.validate(e.target, inputValue);
            }
        });
    }

    // Restrict input to digits only for PESEL field, max 11 chars
    setupInputValidation('pesel', {
        transform: function(value) {
            // Replace any non-digit characters and limit to 11 characters
            let cleaned = value.replace(/[^0-9]/g, '');
            return cleaned.length > 11 ? cleaned.slice(0, 11) : cleaned;
        },
        validate: function(field, value) {
            // Real-time validation feedback
            const peselFeedback = document.getElementById('pesel-feedback');

            if (value && value.length !== 11) {
                // If there's any input but it's not 11 digits, show error
                if (!peselFeedback) {
                    // Create feedback element if it doesn't exist
                    const feedbackEl = document.createElement('div');
                    feedbackEl.id = 'pesel-feedback';
                    feedbackEl.className = 'invalid-feedback d-block';
                    feedbackEl.textContent = 'PESEL musi składać się dokładnie z 11 cyfr';
                    field.classList.add('is-invalid');
                    field.parentNode.appendChild(feedbackEl);
                }
            } else if (value.length === 11) {
                // Valid PESEL (11 digits)
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                if (peselFeedback) {
                    peselFeedback.remove();
                }
            } else if (peselFeedback) {
                // Remove feedback if input is empty
                peselFeedback.remove();
                field.classList.remove('is-invalid');
                field.classList.remove('is-valid');
            }
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

    // Set up address copying features with a common field mapping function
    function setupAllAddressCopyFeatures() {
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
    }
    
    // Call the function to set up all address copy features
    setupAllAddressCopyFeatures();

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

    // Add district school visibility based on grade selection
    const gradeSelect = document.getElementById('grade');
    const districtSchoolSection = document.getElementById('districtSchoolSection');
    
    // Function to toggle district school section visibility based on grade
    function toggleDistrictSchoolVisibility() {
        const selectedGrade = parseInt(gradeSelect.value);
        
        // Only show district school fields for grade 0 (zerówka) or grade 1
        if (selectedGrade <= 1) {
            districtSchoolSection.style.display = 'block';
        } else {
            districtSchoolSection.style.display = 'none';
            
            // Clear district school fields when hidden
            document.getElementById('districtSchoolName').value = '';
            document.getElementById('districtSchoolAddress').value = '';
            document.getElementById('districtSchoolEmail').value = '';
            
            // Remove any validation errors
            ['districtSchoolName', 'districtSchoolAddress', 'districtSchoolEmail'].forEach(fieldId => {
                const field = document.getElementById(fieldId);
                field.classList.remove('is-invalid', 'is-valid');
                
                // Remove feedback elements
                const feedback = field.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.remove();
                }
            });
        }
    }
    
    // Set initial visibility when page loads
    toggleDistrictSchoolVisibility();
    
    // Update visibility when grade changes
    gradeSelect.addEventListener('change', toggleDistrictSchoolVisibility);

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
            // Convert YYYY-MM-DD to DD.MM.YYYY
            const formattedDate = birthDateInput.value.split('-').reverse().join('.');
            formData.set('birthDate', formattedDate);
        }
        
        // Format phone numbers for Google Sheets
        formatPhoneNumbersForSubmission(formData);

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

    /**
     * Format phone numbers to standardized format for Google Sheets
     * @param {FormData} formData - The form data object
     */
    function formatPhoneNumbersForSubmission(formData) {
        ['motherPhone', 'fatherPhone'].forEach(fieldId => {
            const phoneInput = document.getElementById(fieldId);
            if (phoneInput && phoneInput.value) {
                // Keep plus sign for international numbers, remove all other non-digit characters
                let formattedNumber = phoneInput.value;
                const startsWithPlus = formattedNumber.startsWith('+');
                
                // For Google Sheets, prepend with a single quote (') if it has a plus sign
                // This forces Google Sheets to treat it as text and not a formula
                if (startsWithPlus) {
                    // Remove non-digits except the plus sign
                    formattedNumber = '+' + formattedNumber.substring(1).replace(/[^\d]/g, '');
                    // Add single quote at the beginning to prevent Google Sheets formula interpretation
                    formattedNumber = "'" + formattedNumber;
                } else {
                    // Not international format, just remove formatting characters
                    formattedNumber = formattedNumber.replace(/[^\d]/g, '');
                }
                
                // Update the value in the form data
                formData.set(fieldId, formattedNumber);
            }
        });
    }

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

        // Validate basic student information
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
        validateField('birthPlace', { required: true, requiredMessage: 'Proszę podać miejsce urodzenia' });        // Validate address fields
        validateField('resStreetWithNumber', { required: true, requiredMessage: 'Proszę podać ulicę wraz z numerem domu' });
        validateField('resPostalCode', {
            required: true,
            pattern: PATTERNS.POSTAL_CODE,
            requiredMessage: 'Proszę podać kod pocztowy',
            patternMessage: 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)'
        });
        validateField('resCity', { required: true, requiredMessage: 'Proszę podać miejscowość' });
        validateField('resVoivodeship', { required: true, requiredMessage: 'Proszę podać województwo' });
        validateField('resCounty', { required: true, requiredMessage: 'Proszę podać powiat' });
        validateField('resCommune', { required: true, requiredMessage: 'Proszę podać gminę' });

        // Validate registered address fields if "same address" is not checked
        const sameAddressCheckbox = document.getElementById('sameAddress');
        if (!sameAddressCheckbox.checked) {
            validateField('regStreetWithNumber', {
                required: true,
                requiredMessage: 'Proszę podać ulicę wraz z numerem domu w adresie zameldowania'
            });
            validateField('regPostalCode', {
                required: true,
                pattern: PATTERNS.POSTAL_CODE,
                requiredMessage: 'Proszę podać kod pocztowy',
                patternMessage: 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)'
            });
            validateField('regCity', { required: true, requiredMessage: 'Proszę podać miejscowość' });
        }        // Validate school information
        const noCurrentSchoolCheckbox = document.getElementById('noCurrentSchool');
        
        // Only validate current school fields if the "no current school" checkbox is NOT checked
        if (!noCurrentSchoolCheckbox.checked) {
            validateField('currentSchoolName', {
                required: true,
                requiredMessage: 'Proszę podać nazwę obecnej szkoły ucznia'
            });
            validateField('currentSchoolAddress', {
                required: true,
                requiredMessage: 'Proszę podać adres obecnej szkoły ucznia'
            });
        }
        
        // Only validate district school fields for grades 0 and 1
        const selectedGrade = parseInt(document.getElementById('grade').value);
        if (selectedGrade <= 1) {
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
                pattern: PATTERNS.EMAIL,
                requiredMessage: 'Proszę podać adres e-mail szkoły rejonowej',
                patternMessage: 'Proszę podać prawidłowy adres e-mail szkoły rejonowej'
            });
        }

        // Validate parent information using centralized validation
        validateParentInfo('mother', noMotherCheckbox);
        validateParentInfo('father', noFatherCheckbox);        // Helper function to validate checkboxes
        function validateCheckbox(checkbox, errorMessage) {
            if (!checkbox.checked) {
                // Special case for checkbox
                checkbox.classList.add('is-invalid');
                let checkboxContainer = checkbox.closest('.form-check');
                let feedbackElement = checkboxContainer.querySelector('.invalid-feedback');

                if (!feedbackElement) {
                    feedbackElement = document.createElement('div');
                    feedbackElement.className = 'invalid-feedback';
                    checkboxContainer.appendChild(feedbackElement);
                }

                feedbackElement.textContent = errorMessage;
                feedbackElement.style.display = 'block';
                isValid = false;
                
                // Scroll to the first invalid field
                if (checkbox === document.querySelector('.is-invalid')) {
                    checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                return false;
            }
            return true;
        }
        
        // Validate electronic documents agreement
        const agreement = document.getElementById('agreement');
        validateCheckbox(agreement, 'Musisz wyrazić zgodę na otrzymywanie dokumentów w formie elektronicznej');
        
        // Validate data processing consent (required)
        const dataProcessingConsent = document.getElementById('dataProcessingConsent');
        validateCheckbox(dataProcessingConsent, 'Musisz wyrazić zgodę na przetwarzanie danych osobowych');

        return isValid;
        
        // Helper function to validate parent information
        function validateParentInfo(parentType, checkboxElement) {
            if (!checkboxElement || !checkboxElement.checked) {
                // Only validate if parent data should be provided
                validateField(parentType + 'FirstName', { 
                    required: true, 
                    requiredMessage: 'Proszę podać imię ' + (parentType === 'mother' ? 'mamy' : 'taty') 
                });
                
                validateField(parentType + 'LastName', {
                    required: true,
                    requiredMessage: 'Proszę podać nazwisko ' + (parentType === 'mother' ? 'mamy' : 'taty')
                });
                
                validateField(parentType + 'Phone', {
                    required: true,
                    pattern: PATTERNS.PHONE,
                    requiredMessage: 'Proszę podać numer telefonu ' + (parentType === 'mother' ? 'mamy' : 'taty'),
                    patternMessage: 'Proszę podać prawidłowy numer telefonu'
                });
                
                validateField(parentType + 'Email', {
                    required: true,
                    pattern: PATTERNS.EMAIL,
                    requiredMessage: 'Proszę podać adres e-mail ' + (parentType === 'mother' ? 'mamy' : 'taty'),
                    patternMessage: 'Proszę podać prawidłowy adres e-mail ' + (parentType === 'mother' ? 'mamy' : 'taty')
                });
                
                validateField(parentType + 'Id', { 
                    required: true, 
                    requiredMessage: 'Proszę podać numer dokumentu tożsamości ' + (parentType === 'mother' ? 'mamy' : 'taty')
                });

                // Validate parent's address if "same address" checkbox is not checked
                const sameAddressCheckbox = document.getElementById(parentType + 'SameAddress');
                if (!sameAddressCheckbox.checked) {
                    validateField(parentType + 'StreetWithNumber', {
                        required: true,
                        requiredMessage: 'Proszę podać ulicę wraz z numerem domu ' + (parentType === 'mother' ? 'mamy' : 'taty')
                    });
                    
                    validateField(parentType + 'PostalCode', {
                        required: true,
                        pattern: PATTERNS.POSTAL_CODE,
                        requiredMessage: 'Proszę podać kod pocztowy',
                        patternMessage: 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)'
                    });
                    
                    validateField(parentType + 'City', { 
                        required: true, 
                        requiredMessage: 'Proszę podać miejscowość' 
                    });
                }
            }
        }
    }

    // Set up input formatting for phone and postal code fields
    function setupInputFormatters() {
        // Phone number input formatting
        ['motherPhone', 'fatherPhone'].forEach(function (fieldId) {
            setupInputValidation(fieldId, {
                transform: function(value) {
                    // Allow digits, plus sign, spaces, dashes, and brackets
                    let cleaned = value.replace(/[^\d\s+\-()]/g, '');
                    
                    // Ensure plus sign is only at the beginning if present
                    if (cleaned.indexOf('+') > 0) {
                        cleaned = cleaned.replace(/\+/g, '');
                        if (!cleaned.startsWith('+')) {
                            cleaned = '+' + cleaned;
                        }
                    }
                    
                    // Limit to reasonable length
                    return cleaned.length > 25 ? cleaned.slice(0, 25) : cleaned;
                }
            });
        });

        // Postal code input formatting
        ['resPostalCode', 'regPostalCode', 'motherPostalCode', 'fatherPostalCode'].forEach(function (fieldId) {
            setupInputValidation(fieldId, {
                transform: formatPostalCode
            });
        });
    }
    
    // Call setup for input formatters
    setupInputFormatters();

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