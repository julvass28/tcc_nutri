import { useState } from "react";
import "../css/AGUACalculator.css";

function AGUACalculator() {

    const [idade, setIdade] = useState("")
    const [peso, setPeso] = useState("")
    const [mlTotal, setMlTotal] = useState("")
    const [aguaLitros, setAguaLitros] = useState("")

    function calcularAgua() {
        let ml = 0

        if (idade <= 8) {
            ml = 50
        } else if (idade <= 18) {
            ml = 40
        } else if (idade <= 55) {
            ml = 35
        } else if (idade <= 65) {
            ml = 30
        } else {
            ml = 25
        }

        const totalMl = peso * ml
        const totalLitros = (totalMl / 1000).toFixed(2)

        setMlTotal(totalMl)
        setAguaLitros(totalLitros)
        

    }

    function reCalcular() {
        setIdade("")
        setPeso("")
        setMlTotal("")
        setAguaLitros("")
    }

    return (
        <div>
            <h1>Calculadora de Água</h1>
            <div className="formulario">
                <label>Idade:</label>
                <input type="number" value={idade} onChange={(e) => setIdade(Number(e.target.value))} />
                <label>Peso:</label>
                <input type="number" value={peso} onChange={(e) => setPeso(Number(e.target.value))} />
                <button onClick={calcularAgua}>Calcular</button>
                <button onClick={reCalcular}>Recalcular</button>
            </div>
            {aguaLitros && (
                <div className="resultado">
                    <h2>Resultado:</h2>
                    <p>{`Você deve beber ${aguaLitros} litros de água por dia.`}</p>
                    <div className="informacao">
                <p>Essa calculadora é apenas uma estimativa. Consulte um profissional de saúde para recomendações personalizadas.</p>
            </div>
                </div>
                
            )}
            
        </div>
    )
}

export default AGUACalculator