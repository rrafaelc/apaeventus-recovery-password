// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const encryptedEmail = urlParams.get('data');

// API base URL - change this to your actual API URL
const API_BASE_URL = 'http://18.191.252.46';

// Password validation rules
const passwordRules = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
};

// Function to show error message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
}

// Function to hide error message
function hideError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.classList.add('d-none');
}

// Function to set loading state
function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.spinner-border');
    
    button.disabled = isLoading;
    if (isLoading) {
        buttonText.classList.add('d-none');
        spinner.classList.remove('d-none');
    } else {
        buttonText.classList.remove('d-none');
        spinner.classList.add('d-none');
    }
}

// Function to clear code inputs
function clearCodeInputs() {
    document.querySelectorAll('.code-input').forEach(input => {
        input.value = '';
    });
}

// Check if we have the encrypted email
if (!encryptedEmail) {
    showError('Link inválido. Por favor, use o link enviado para seu email.');
}

// Setup code input handling
document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.querySelectorAll('.code-input');
    
    // Focus the first input
    codeInputs[0].focus();
    
    codeInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', function(e) {
            hideError();
            if (e.target.value.length === 1) {
                // Move to next input if available
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            if (/^\d+$/.test(pastedData)) {
                pastedData.split('').forEach((digit, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = digit;
                    }
                });
                if (pastedData.length === 6) {
                    codeInputs[5].focus();
                }
            }
        });
    });
});

// Function to get the complete code
function getRecoveryCode() {
    return Array.from(document.querySelectorAll('.code-input'))
        .map(input => input.value)
        .join('');
}

// Function to validate the recovery code
async function validateCode() {
    const code = getRecoveryCode();
    
    if (code.length !== 6) {
        showError('Por favor, digite o código de 6 dígitos.');
        return;
    }

    setLoading('validateButton', true);
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/recover-password/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                encryptedEmail,
                code
            })
        });

        if (response.ok) {
            // Show password step
            document.getElementById('codeStep').classList.add('d-none');
            document.getElementById('passwordStep').classList.remove('d-none');
        } else {
            const data = await response.json();
            showError(data.message || 'Código inválido. Por favor, tente novamente.');
            clearCodeInputs();
            codeInputs[0].focus();
        }
    } catch (error) {
        showError('Erro ao validar código. Por favor, tente novamente.');
        clearCodeInputs();
        codeInputs[0].focus();
    } finally {
        setLoading('validateButton', false);
    }
}

// Function to check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= passwordRules.minLength,
        uppercase: passwordRules.hasUppercase.test(password),
        lowercase: passwordRules.hasLowercase.test(password),
        number: passwordRules.hasNumber.test(password),
        special: passwordRules.hasSpecial.test(password)
    };

    // Update requirement indicators
    document.getElementById('lengthCheck').className = requirements.length ? 'd-block text-success' : 'd-block text-danger';
    document.getElementById('uppercaseCheck').className = requirements.uppercase ? 'd-block text-success' : 'd-block text-danger';
    document.getElementById('lowercaseCheck').className = requirements.lowercase ? 'd-block text-success' : 'd-block text-danger';
    document.getElementById('numberCheck').className = requirements.number ? 'd-block text-success' : 'd-block text-danger';
    document.getElementById('specialCheck').className = requirements.special ? 'd-block text-success' : 'd-block text-danger';

    // Calculate strength
    Object.values(requirements).forEach(met => {
        if (met) strength += 20;
    });

    // Update strength bar
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    strengthBar.style.width = `${strength}%`;
    
    if (strength <= 20) {
        strengthBar.className = 'progress-bar bg-danger';
        strengthText.textContent = 'Fraca';
    } else if (strength <= 40) {
        strengthBar.className = 'progress-bar bg-warning';
        strengthText.textContent = 'Média';
    } else if (strength <= 60) {
        strengthBar.className = 'progress-bar bg-info';
        strengthText.textContent = 'Boa';
    } else if (strength <= 80) {
        strengthBar.className = 'progress-bar bg-primary';
        strengthText.textContent = 'Forte';
    } else {
        strengthBar.className = 'progress-bar bg-success';
        strengthText.textContent = 'Muito forte';
    }

    return strength === 100;
}

// Add password strength check on input
document.getElementById('newPassword').addEventListener('input', function(e) {
    hideError();
    checkPasswordStrength(e.target.value);
});

// Function to reset password
async function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const code = getRecoveryCode();

    if (!checkPasswordStrength(newPassword)) {
        showError('Por favor, atenda a todos os requisitos de senha.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showError('As senhas não coincidem.');
        return;
    }

    setLoading('resetButton', true);
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/recover-password/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                encryptedEmail,
                code,
                newPassword
            })
        });

        if (response.ok) {
            // Show success step
            document.getElementById('passwordStep').classList.add('d-none');
            document.getElementById('successStep').classList.remove('d-none');
        } else {
            const data = await response.json();
            showError(data.message || 'Erro ao redefinir senha. Por favor, tente novamente.');
        }
    } catch (error) {
        showError('Erro ao redefinir senha. Por favor, tente novamente.');
    } finally {
        setLoading('resetButton', false);
    }
} 