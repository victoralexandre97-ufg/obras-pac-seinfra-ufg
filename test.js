const fs = require('fs');
const pac = JSON.parse(fs.readFileSync('pac_data.json', 'utf8'));

try {
    pac.forEach((obra, index) => {
        if (index < 3) {
            const formatExcelDate = (excelDate) => {
                if (!excelDate) return "-";
                const date = new Date((excelDate - 25569) * 86400 * 1000);
                return date.toLocaleDateString('pt-BR');
            };
        
            const dataInicio = formatExcelDate(obra['INICIO DA OBRA']);
            const valorContrato = obra['VALOR DO CONTRATO'] || 0;
            const valorMedido = obra['VALOR MEDIDO'] || 0;
            const valorRestante = Math.max(0, valorContrato - valorMedido);
            
            console.log("Processing index", index);
        }
    });
    console.log("Success");
} catch(e) {
    console.error(e);
}
