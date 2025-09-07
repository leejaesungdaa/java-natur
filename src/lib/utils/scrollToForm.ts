export const scrollToForm = (delay: number = 100) => {
    setTimeout(() => {
        const formElement = document.querySelector('[data-edit-form]');
        if (formElement) {
            formElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        } else {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        }
    }, delay);
};