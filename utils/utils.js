
export const selecionarEtapa = (etapa) => {
    if (etapa == "Etapa 1") {
      return { velocidad: 2.7, grados: 0, tiempo: 3, vodos: 2.3, etapa: 1 };
    }
    if (etapa == "Etapa 2") {
      return { velocidad: 2.7, grados: 5, tiempo: 3, vodos: 3.5, etapa: 2 };
    }
    if (etapa == "Etapa 3") {
      return { velocidad: 2.7, grados: 10, tiempo: 3, vodos: 4.6, etapa: 3 };
    }
    if (etapa == "Etapa 4") {
      return { velocidad: 4, grados: 12, tiempo: 3, vodos: 7, etapa: 4 };
    }
    if (etapa == "Etapa 5") {
      return { velocidad: 5.4, grados: 14, tiempo: 3, vodos: 10.1, etapa: 5 };
    }
    if (etapa == "Etapa 6") {
      return { velocidad: 6.7, grados: 16, tiempo: 3, vodos: 12.9, etapa: 6 };
    }
    if (etapa == "Etapa 7") {
      return { velocidad: 8.0, grados: 18, tiempo: 3, vodos: 15, etapa: 7 };
    }
    if (etapa == "Etapa 8") {
      return { velocidad: 8.8, grados: 20, tiempo: 3, vodos: 16, etapa: 8 };
    }
    if (etapa == "Etapa 9") {
      return { velocidad: 10.5, grados: 22, tiempo: 3, vodos: 19.1, etapa: 9 };
    }
  };
  
  
export const calculoImc = (data) => {
    const { peso, talla } = data;
  
    const calculoImc = peso / (talla * talla);
    if (calculoImc < 0) {
      return { mensaje: "Error al calcular el imc", rp: "no" };
    }
    // Determinar la descripción de IMC según el valor de IMC
    if (calculoImc < 18.5) {
      return { imcdescripcion: "Bajo peso", imc: calculoImc, peso: peso };
    }
    if (calculoImc >= 18.5 && calculoImc <= 24.9) {
      return { imcdescripcion: "Normal", imc: calculoImc, peso: peso };
    }
    if (calculoImc >= 25.0 && calculoImc <= 29.9) {
      return { imcdescripcion: "Sobrepeso", imc: calculoImc, peso: peso };
    }
    if (calculoImc >= 30.0 && calculoImc <= 34.9) {
      return { imcdescripcion: "Obesidad grado 1", imc: calculoImc, peso: peso };
    }
    if (calculoImc >= 35.0 && calculoImc <= 39.9) {
      return { imcdescripcion: "Obesidad grado 2", imc: calculoImc, peso: peso };
    } else {
      return { imcdescripcion: "Obesidad grado 3", imc: calculoImc, peso: peso };
    }
  };