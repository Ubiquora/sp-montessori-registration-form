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
    
    // Call the function to prepopulate form when page loads
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
        // Remove non-digits
        let formattedValue = value.replace(/[^0-9]/g, '');
        
        // Add hyphen after first two digits
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2) + '-' + formattedValue.slice(2);
        }
        
        // Limit length to 6 characters (including hyphen)
        if (formattedValue.length > 6) {
            formattedValue = formattedValue.slice(0, 6);
        }
        
        return formattedValue;
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
        checkbox.addEventListener('change', function() {
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
            document.getElementById(sourceId)?.addEventListener('input', function() {
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

    // Form validation and submission
    registrationForm.addEventListener('submit', function (event) {
        // Prevent default submission
        event.preventDefault();

        // Only use our custom validation
        if (!validateForm()) {
            return false;
        }

        // If form is valid, collect the data
        const formData = new FormData(registrationForm);

        // URL for Google Sheets script
        const sheetScriptURL = "https://script.google.com/macros/s/AKfycbwZJBpP5An4M0MdDYPeGopx7dvk-5-NerMa-9-dRg1kab85Zz9gU9sUIP6Qb99pnx5N/exec";

        // Show loading indicator
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Wysyłanie...';

        console.log(new URLSearchParams(formData).toString());
        // Send data to Google Sheets
        fetch(sheetScriptURL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData).toString()
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

                // Uncheck the "same address" checkboxes
                document.getElementById('sameAddress').checked = false;
                document.getElementById('motherSameAddress').checked = false;
                document.getElementById('fatherSameAddress').checked = false;

                // Reset the registered address section state
                document.getElementById('registeredAddressSection').classList.remove('auto-filled');
                document.getElementById('regStreetWithNumber').disabled = false;
                document.getElementById('regPostalCode').disabled = false;
                document.getElementById('regCity').disabled = false;

                // Reset the mother's address section state
                document.getElementById('motherAddressSection').classList.remove('auto-filled');
                document.getElementById('motherStreetWithNumber').disabled = false;
                document.getElementById('motherPostalCode').disabled = false;
                document.getElementById('motherCity').disabled = false;

                // Reset the father's address section state
                document.getElementById('fatherAddressSection').classList.remove('auto-filled');
                document.getElementById('fatherStreetWithNumber').disabled = false;
                document.getElementById('fatherPostalCode').disabled = false;
                document.getElementById('fatherCity').disabled = false;
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

        // Validate PESEL (11 digits)
        const pesel = document.getElementById('pesel');
        if (!pesel.value || !/^\d{11}$/.test(pesel.value)) {
            markInvalid(pesel, !pesel.value ? 'Proszę podać numer PESEL' : 'PESEL musi składać się dokładnie z 11 cyfr');
        }

        // Validate first name
        const firstName = document.getElementById('firstName');
        if (!firstName.value.trim()) {
            markInvalid(firstName, 'Proszę podać imię ucznia');
        }

        // Validate last name
        const lastName = document.getElementById('lastName');
        if (!lastName.value.trim()) {
            markInvalid(lastName, 'Proszę podać nazwisko ucznia');
        }

        // Validate birth date
        const birthDate = document.getElementById('birthDate');
        if (!birthDate.value) {
            markInvalid(birthDate, 'Proszę podać datę urodzenia');
        }

        // Validate birthPlace
        const birthPlace = document.getElementById('birthPlace');
        if (!birthPlace.value.trim()) {
            markInvalid(birthPlace, 'Proszę podać miejsce urodzenia');
        }

        // Validate residence street
        const resStreetWithNumber = document.getElementById('resStreetWithNumber');
        if (!resStreetWithNumber.value.trim()) {
            markInvalid(resStreetWithNumber, 'Proszę podać ulicę wraz z numerem domu');
        }

        // Validate residence postal code
        const resPostalCode = document.getElementById('resPostalCode');
        if (!resPostalCode.value || !/^\d{2}-\d{3}$/.test(resPostalCode.value)) {
            markInvalid(resPostalCode, 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)');
        }

        // Validate residence city
        const resCity = document.getElementById('resCity');
        if (!resCity.value.trim()) {
            markInvalid(resCity, 'Proszę podać miejscowość');
        }

        // Validate registered address fields if "same address" is not checked
        const sameAddressCheckbox = document.getElementById('sameAddress');
        if (!sameAddressCheckbox.checked) {
            const regStreetWithNumber = document.getElementById('regStreetWithNumber');
            if (!regStreetWithNumber.value.trim()) {
                markInvalid(regStreetWithNumber, 'Proszę podać ulicę wraz z numerem domu w adresie zameldowania');
            }

            const regPostalCode = document.getElementById('regPostalCode');
            if (!regPostalCode.value || !/^\d{2}-\d{3}$/.test(regPostalCode.value)) {
                markInvalid(regPostalCode, 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)');
            }

            const regCity = document.getElementById('regCity');
            if (!regCity.value.trim()) {
                markInvalid(regCity, 'Proszę podać miejscowość');
            }
        }

        // Validate current school information
        const currentSchoolName = document.getElementById('currentSchoolName');
        if (!currentSchoolName.value.trim()) {
            markInvalid(currentSchoolName, 'Proszę podać nazwę obecnej szkoły ucznia');
        }

        const currentSchoolAddress = document.getElementById('currentSchoolAddress');
        if (!currentSchoolAddress.value.trim()) {
            markInvalid(currentSchoolAddress, 'Proszę podać adres obecnej szkoły ucznia');
        }

        // Validate district school information
        const districtSchoolName = document.getElementById('districtSchoolName');
        if (!districtSchoolName.value.trim()) {
            markInvalid(districtSchoolName, 'Proszę podać nazwę szkoły rejonowej');
        }

        const districtSchoolAddress = document.getElementById('districtSchoolAddress');
        if (!districtSchoolAddress.value.trim()) {
            markInvalid(districtSchoolAddress, 'Proszę podać adres szkoły rejonowej');
        }

        const districtSchoolEmail = document.getElementById('districtSchoolEmail');
        if (!districtSchoolEmail.value.trim()) {
            markInvalid(districtSchoolEmail, 'Proszę podać adres e-mail szkoły rejonowej');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(districtSchoolEmail.value)) {
            markInvalid(districtSchoolEmail, 'Proszę podać prawidłowy adres e-mail szkoły rejonowej');
        }

        // Validate mother's information
        const motherFirstName = document.getElementById('motherFirstName');
        if (!motherFirstName.value.trim()) {
            markInvalid(motherFirstName, 'Proszę podać imię matki');
        }

        const motherLastName = document.getElementById('motherLastName');
        if (!motherLastName.value.trim()) {
            markInvalid(motherLastName, 'Proszę podać nazwisko matki');
        }

        const motherPhone = document.getElementById('motherPhone');
        if (!motherPhone.value.trim()) {
            markInvalid(motherPhone, 'Proszę podać numer telefonu matki');
        } else if (!/^\d{9}$/.test(motherPhone.value)) {
            markInvalid(motherPhone, 'Numer telefonu powinien składać się z 9 cyfr bez myślników i spacji');
        }

        const motherEmail = document.getElementById('motherEmail');
        if (!motherEmail.value.trim()) {
            markInvalid(motherEmail, 'Proszę podać adres e-mail matki');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(motherEmail.value)) {
            markInvalid(motherEmail, 'Proszę podać prawidłowy adres e-mail matki');
        }

        // Validate mother's address if checkbox is not checked
        const motherSameAddressCheckbox = document.getElementById('motherSameAddress');
        if (!motherSameAddressCheckbox.checked) {
            const motherStreetWithNumber = document.getElementById('motherStreetWithNumber');
            if (!motherStreetWithNumber.value.trim()) {
                markInvalid(motherStreetWithNumber, 'Proszę podać ulicę wraz z numerem domu mamy');
            }

            const motherPostalCode = document.getElementById('motherPostalCode');
            if (!motherPostalCode.value || !/^\d{2}-\d{3}$/.test(motherPostalCode.value)) {
                markInvalid(motherPostalCode, 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)');
            }

            const motherCity = document.getElementById('motherCity');
            if (!motherCity.value.trim()) {
                markInvalid(motherCity, 'Proszę podać miejscowość');
            }
        }

        // Validate father's information
        const fatherFirstName = document.getElementById('fatherFirstName');
        if (!fatherFirstName.value.trim()) {
            markInvalid(fatherFirstName, 'Proszę podać imię ojca');
        }

        const fatherLastName = document.getElementById('fatherLastName');
        if (!fatherLastName.value.trim()) {
            markInvalid(fatherLastName, 'Proszę podać nazwisko ojca');
        }

        const fatherPhone = document.getElementById('fatherPhone');
        if (!fatherPhone.value.trim()) {
            markInvalid(fatherPhone, 'Proszę podać numer telefonu ojca');
        } else if (!/^\d{9}$/.test(fatherPhone.value)) {
            markInvalid(fatherPhone, 'Numer telefonu powinien składać się z 9 cyfr bez myślników i spacji');
        }

        const fatherEmail = document.getElementById('fatherEmail');
        if (!fatherEmail.value.trim()) {
            markInvalid(fatherEmail, 'Proszę podać adres e-mail ojca');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fatherEmail.value)) {
            markInvalid(fatherEmail, 'Proszę podać prawidłowy adres e-mail ojca');
        }

        // Validate father's address if checkbox is not checked
        const fatherSameAddressCheckbox = document.getElementById('fatherSameAddress');
        if (!fatherSameAddressCheckbox.checked) {
            const fatherStreetWithNumber = document.getElementById('fatherStreetWithNumber');
            if (!fatherStreetWithNumber.value.trim()) {
                markInvalid(fatherStreetWithNumber, 'Proszę podać ulicę wraz z numerem domu ojca');
            }

            const fatherPostalCode = document.getElementById('fatherPostalCode');
            if (!fatherPostalCode.value || !/^\d{2}-\d{3}$/.test(fatherPostalCode.value)) {
                markInvalid(fatherPostalCode, 'Kod pocztowy powinien być w formacie XX-XXX (np. 00-000)');
            }

            const fatherCity = document.getElementById('fatherCity');
            if (!fatherCity.value.trim()) {
                markInvalid(fatherCity, 'Proszę podać miejscowość');
            }
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