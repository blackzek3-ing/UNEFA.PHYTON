document.addEventListener('DOMContentLoaded', () => {  
    const pantallaAnterior = document.getElementById('pantalla-anterior');
    const pantallaActual = document.getElementById('pantalla-actual');
    
    let valorActual = '';
    let valorAnterior = '';
    let operadorActual = undefined;
    let reinicioPantalla = false; 
    
    document.querySelectorAll('.numero').forEach(boton => {
        boton.addEventListener('click', () => {
            if (reinicioPantalla) {
                valorActual = '';
                reinicioPantalla = false;
            }
        
            if (boton.innerText === '.' && valorActual.includes('.')) return;

            valorActual += boton.innerText;
            pantallaActual.innerText = valorActual; 
        });
    });

    document.querySelectorAll('.operador').forEach(boton => {
        boton.addEventListener('click', async () => {
            if (valorActual === '') return;
            
            if (valorAnterior !== '' && operadorActual) {
                await realizarCalculo(); 
            }
            
            operadorActual = boton.getAttribute('data-operador');
            valorAnterior = valorActual;
            pantallaAnterior.innerText = `${valorActual} ${operadorActual}`;
            reinicioPantalla = true;
        });
    });

    document.getElementById('equals').addEventListener('click', () => {
        if (valorActual === '' || valorAnterior === '' || !operadorActual) return;
        realizarCalculo();
    });

    document.getElementById('clear').addEventListener('click', () => {
        valorActual = valorAnterior = '';
        operadorActual = undefined;
        pantallaAnterior.innerText = '';
        pantallaActual.innerText = '0';
    });

    async function realizarCalculo() {
        try {
        
            const response = await fetch('/calcular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ num1: valorAnterior, operador: operadorActual, num2: valorActual })
            });

            const data = await response.json();

            if (data.resultado === 'Error') throw new Error('Error de cálculo');

            valorActual = data.resultado.toString();
            operadorActual = undefined;
            valorAnterior = '';
            pantallaAnterior.innerText = '';
            pantallaActual.innerText = valorActual;
            reinicioPantalla = true;

        } catch (error) {
            pantallaActual.innerText = 'Error';
            valorActual = '';
            reinicioPantalla = true;
        }
    }
});

