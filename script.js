class FormulaEval extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.evaluateFormula();
        this.setupEventListeners();
    }

    evaluateFormula() {
        const formula = this.getAttribute('evaluator');
        let evaluatedFormula = formula;

        const listOfInputs = document.querySelectorAll('input');
        for (const input of listOfInputs) {
            const id = input.id;
            const value = parseFloat(input.value) || 0;
            evaluatedFormula = evaluatedFormula.replace(
                new RegExp(`\\b${id}\\b`, 'g'),
                '(' + value + ')'
            );
        }

        try {
            const result = eval(evaluatedFormula);
            this.textContent = `Result: ${result}`;
        } catch (e) {
            this.textContent = 'Error in formula';
        }
    }

    setupEventListeners() {
        const listOfInputs = document.querySelectorAll('input');
        for (const input of listOfInputs) {
            input.addEventListener('input', () => this.evaluateFormula());
        }
    }
}

customElements.define('formula-eval', FormulaEval);