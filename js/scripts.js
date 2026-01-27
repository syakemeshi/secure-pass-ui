document.addEventListener('DOMContentLoaded', () => {
    const defaultConfig = {
        background_color: "#f0f4f8",
        surface_color: "#ffffff",
        text_color: "#1a202c",
        primary_action_color: "#2563eb",
        secondary_action_color: "#eae5ebff",
        font_family: "system-ui",
        font_size: 16,
        title: "Password generator (by sld)",
        generate_button: "Generar Contraseña",
        copy_button: "Copiar"
    };

    let currentPassword = '';

    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const includeUppercase = document.getElementById('includeUppercase');
    const includeLowercase = document.getElementById('includeLowercase');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSymbols = document.getElementById('includeSymbols');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const notification = document.getElementById('notification');

    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        let charset = '';

        if (includeUppercase.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers.checked) charset += '0123456789';
        if (includeSymbols.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (charset === '') {
            showNotification('Selecciona al menos una opción', false);
            return;
        }

        let password = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        currentPassword = password;
        passwordDisplay.innerHTML = `<span class="text-gray-900">${password}</span>`;
        copyBtn.disabled = false;
    }

    function copyToClipboard() {
        if (!currentPassword) return;

        navigator.clipboard.writeText(currentPassword).then(() => {
            showNotification('✓ Contraseña copiada', true);
        }).catch(() => {
            showNotification('Error al copiar', false);
        });
    }

    function showNotification(message, isSuccess) {
        notification.textContent = message;
        notification.className = `mt-4 text-sm font-medium transition-opacity ${isSuccess ? 'text-green-600' : 'text-red-600'}`;
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
        }, 2000);
    }

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);

    async function onConfigChange(config) {
        const app = document.getElementById('app');
        const title = document.getElementById('title');
        const genBtn = document.getElementById('generateBtn');
        const cpyBtn = document.getElementById('copyBtn');
        const display = document.getElementById('passwordDisplay');

        const bgColor = config.background_color || defaultConfig.background_color;
        const surfaceColor = config.surface_color || defaultConfig.surface_color;
        const textColor = config.text_color || defaultConfig.text_color;
        const primaryColor = config.primary_action_color || defaultConfig.primary_action_color;
        const secondaryColor = config.secondary_action_color || defaultConfig.secondary_action_color;
        const fontFamily = config.font_family || defaultConfig.font_family;
        const fontSize = config.font_size || defaultConfig.font_size;

        app.style.background = 'transparent';
        app.style.color = textColor;
        app.style.fontFamily = `${fontFamily}, system-ui, sans-serif`;

        title.textContent = config.title || defaultConfig.title;
        title.style.fontSize = `${fontSize * 1.875}px`;
        title.style.color = textColor;

        display.style.background = surfaceColor;
        display.style.color = textColor;
        display.style.fontSize = `${fontSize * 1.25}px`;

        genBtn.textContent = config.generate_button || defaultConfig.generate_button;
        genBtn.style.background = primaryColor;
        genBtn.style.fontSize = `${fontSize}px`;

        cpyBtn.textContent = config.copy_button || defaultConfig.copy_button;
        cpyBtn.style.background = secondaryColor;
        cpyBtn.style.color = textColor;
        cpyBtn.style.fontSize = `${fontSize}px`;

        const labels = document.querySelectorAll('label span');
        labels.forEach(label => {
            label.style.color = textColor;
            label.style.fontSize = `${fontSize * 0.875}px`;
        });
    }

    if (window.elementSdk) {
        window.elementSdk.init({
            defaultConfig,
            onConfigChange,
            mapToCapabilities: (config) => ({
                recolorables: [
                    { get: () => config.background_color || defaultConfig.background_color, set: (value) => { config.background_color = value; window.elementSdk.setConfig({ background_color: value }); } },
                    { get: () => config.surface_color || defaultConfig.surface_color, set: (value) => { config.surface_color = value; window.elementSdk.setConfig({ surface_color: value }); } },
                    { get: () => config.text_color || defaultConfig.text_color, set: (value) => { config.text_color = value; window.elementSdk.setConfig({ text_color: value }); } },
                    { get: () => config.primary_action_color || defaultConfig.primary_action_color, set: (value) => { config.primary_action_color = value; window.elementSdk.setConfig({ primary_action_color: value }); } },
                    { get: () => config.secondary_action_color || defaultConfig.secondary_action_color, set: (value) => { config.secondary_action_color = value; window.elementSdk.setConfig({ secondary_action_color: value }); } }
                ],
                borderables: [],
                fontEditable: {
                    get: () => config.font_family || defaultConfig.font_family,
                    set: (value) => { config.font_family = value; window.elementSdk.setConfig({ font_family: value }); }
                },
                fontSizeable: {
                    get: () => config.font_size || defaultConfig.font_size,
                    set: (value) => { config.font_size = value; window.elementSdk.setConfig({ font_size: value }); }
                }
            }),
            mapToEditPanelValues: (config) => new Map([
                ["title", config.title || defaultConfig.title],
                ["generate_button", config.generate_button || defaultConfig.generate_button],
                ["copy_button", config.copy_button || defaultConfig.copy_button]
            ])
        });
    } else {
        onConfigChange(defaultConfig);
    }
});
