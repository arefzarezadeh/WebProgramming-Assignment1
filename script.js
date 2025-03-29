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

        document.querySelectorAll('input').forEach(input => {
            const id = input.id;
            const value = parseFloat(input.value) || 0;
            evaluatedFormula = evaluatedFormula.replace(
                new RegExp(`\\b${id}\\b`, 'g'),
                '(' + value + ')'
            );
        });

        try {
            const result = eval(evaluatedFormula);
            this.textContent = `Result: ${result}`;
        } catch (e) {
            this.textContent = 'Error in formula';
            console.log(e);
            console.log(evaluatedFormula);
            console.log(formula);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.evaluateFormula());
        });
    }
}

// Register the custom element with a hyphenated name
customElements.define('formula-eval', FormulaEval);