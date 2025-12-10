document.addEventListener('DOMContentLoaded', () => {  
    const pantallaAnterior = document.getElementById('pantalla-anterior');
    const pantallaActual = document.getElementById('pantalla-actual');
    const botonesNumero = document.querySelectorAll('.numero');
    const botonesOperador = document.querySelectorAll('.operador');
    const botonIgual = document.getElementById('equals');
    const botonClear = document.getElementById('clear');

    let valorActual = '';
    let valorAnterior = '';
    let operadorActual = undefined;
    let reinicioPantalla = false; 
    
    botonesNumero.forEach(boton => {
        boton.addEventListener('click', () => {
            const numero = boton.innerText;

            if (reinicioPantalla) {
                valorActual = '';
                reinicioPantalla = false;
            }

            if (numero === '.' && valorActual.includes('.')) return;
            if (numero === ',' && valorActual.includes(',')) return;

            valorActual = valorActual.toString() + numero.toString();
            actualizarDisplay();
        });
    });

    botonesOperador.forEach(boton => {
        boton.addEventListener('click', () => {
            if (valorActual === '') return;
            
            if (valorAnterior !== '' && operadorActual !== undefined) {
                realizarCalculo().then(() => {
                    operadorActual = boton.getAttribute('data-operador');
                    valorAnterior = valorActual;
                    pantallaAnterior.innerText = valorActual + ' ' + operadorActual;
                    reinicioPantalla = true;
                });
            } else {
                operadorActual = boton.getAttribute('data-operador');
                valorAnterior = valorActual;
                pantallaAnterior.innerText = valorActual + ' ' + operadorActual;
                reinicioPantalla = true;
            }
        });
    });

    botonIgual.addEventListener('click', () => {
        if (valorActual === '' || valorAnterior === '' || operadorActual === undefined) return;
        
        realizarCalculo();
    });

    botonClear.addEventListener('click', () => {
        valorActual = '';
        valorAnterior = '';
        operadorActual = undefined;
        pantallaAnterior.innerText = '';
        pantallaActual.innerText = '0';
    });

    function actualizarDisplay() {
        pantallaActual.innerText = valorActual === '' ? '0' : valorActual;
    }

    async function realizarCalculo() {
        const num1 = valorAnterior;
        const num2 = valorActual;
        const operador = operadorActual;

        try {
            const response = await fetch('/calcular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ num1, operador, num2 })
            });

            const data = await response.json();

            if (data.resultado === 'Error') {
                pantallaActual.innerText = 'Error';
                valorActual = '';
                valorAnterior = '';
                operadorActual = undefined;
            } else {
                valorActual = data.resultado.toString();
                operadorActual = undefined;
                valorAnterior = '';
                pantallaAnterior.innerText = '';
                pantallaActual.innerText = valorActual;
                reinicioPantalla = true;
            }
        } catch (error) {
            console.error('Error:', error);
            pantallaActual.innerText = 'Error';
        }
    }
});
