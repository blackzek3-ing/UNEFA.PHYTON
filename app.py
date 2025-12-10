from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def calcular_resultado(num1, operador, num2):
    try:

        n1 = float(str(num1).replace(',', '.'))
        n2 = float(str(num2).replace(',', '.'))
        
        resultado = 0

        if operador == '+':
            resultado = n1 + n2
        elif operador == '-':
            resultado = n1 - n2
        elif operador == '*':
            resultado = n1 * n2
        elif operador == '/':
            if n2 == 0:
                return "Error:División por cero" 
            resultado = n1 / n2
        else:
            return "Error"
        
        if resultado.is_integer():
            return str(int(resultado))
        else:
            return f"{resultado:.2f}".replace('.', ',')
            
    except ValueError:
        return "Error"
    except Exception as e:
        print(f"Error servidor: {e}") 
        return "Error"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def manejar_calculo():
    data = request.get_json()
    
    num1 = data.get('num1', 0)
    operador = data.get('operador')
    num2 = data.get('num2', 0)
    
    resultado_calculado = calcular_resultado(num1, operador, num2)
    
    return jsonify({
        'resultado': resultado_calculado
    })

if __name__ == "__main__":
    app.run(debug=True)
