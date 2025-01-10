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
    

    // Soumission du formulaire
    document.querySelector(".btn-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            // Insertion du client, puis du représentant
            await insertClient();
            await insertRepresentantClient();
            alert("Formulaire soumis avec succès !");
            window.location.href = `suiteBilan.html?siret=${encodeURIComponent(numSIRET)}`;
        } catch (err) {
            alert(err.message);
        }
    });
  });
  