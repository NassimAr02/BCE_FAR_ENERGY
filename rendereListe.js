    document.addEventListener("DOMContentLoaded", () => {
        const steps = document.querySelectorAll(".step");
        const forms = document.querySelectorAll(".form");
        const nextButtons = document.querySelectorAll(".btn-next");
        const prevButtons = document.querySelectorAll(".btn-prev");
    
        let currentStep = 0;
    
        const updateStep = (step) => {
            steps.forEach((stepEl, index) => {
                stepEl.classList.toggle("step-active", index === step);
            });
            forms.forEach((formEl, index) => {
                formEl.classList.toggle("form-active", index === step);
            });
        };
    
        nextButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateStep(currentStep);
                }
            });
        });
    
        prevButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateStep(currentStep);
                }
            });
        });
})  