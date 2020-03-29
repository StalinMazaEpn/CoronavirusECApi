
async function getData() {
    const response = await fetch('../db.json')
    const data = await response.json()
    return data
}


async function getConfirmadosPorProvincia(data) {
    // const data = await getData();
    const provinciasOrdenadas = _.orderBy(data.provincias, prov => prov.confirmados, ['desc'])
    return provinciasOrdenadas;
}
async function getFallecidosPorProvincia(data) {
    // const data = await getData();
    console.log('data', data);
    const provinciasOrdenadas = _.orderBy(data.provincias, prov => prov.fallecidos, ['desc'])
    return provinciasOrdenadas;
}

function getRandomColor(format = 'rgba') {
    return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
  }
  

function totalConfirmadosProvinciaChart(data, ctx) {  
    let customLabels = [];
    let customData = [];
    let colors = [];
    data.forEach(province =>{
        if(province.confirmados > 0){
            customLabels.push(province.nombre);
            customData.push(province.confirmados);
            colors.push(getRandomColor())
        }
    });
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: customLabels,
            datasets: [{
                data: customData,
                backgroundColor: colors
            }],
           
        },
        
        options: {           
            title: {
                display: true,
                text: 'Todos los casos confirmados en Ecuador por Provincia COVID-19',
                fontSize: 20,
                padding: 10,
                fontColor: '#12619c',
            },
            responsive: false, 
        }
    })
}

function totalFallecidosProvinciaChart(data, ctx) {  
    let customLabels = [];
    let customData = [];
    let colors = [];
    data.forEach(province =>{
        if(province.fallecidos > 0){
            customLabels.push(province.nombre);
            customData.push(province.fallecidos);
            colors.push(getRandomColor())
        }
    });
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: customLabels,
            datasets: [{
                data: customData,
                backgroundColor: colors
            }],
           
        },
        
        options: {           
            title: {
                display: true,
                text: 'Todos los casos fallecidos en Ecuador por Provincia COVID-19',
                fontSize: 20,
                padding: 10,
                fontColor: '#12619c',
            },
            responsive: false, 
        }
    })
}

async function renderCharts() {
    const ctxConfirmados = document.querySelector('#chartConfirmados').getContext('2d')
    const ctxFallecidos = document.querySelector('#chartFallecidos').getContext('2d');
    const todosDatos = await getData();
    const datosConfirmados = await getConfirmadosPorProvincia(todosDatos);
    const datosFallecidos = await getFallecidosPorProvincia(todosDatos);
    // console.log('data provinces', data)
    totalConfirmadosProvinciaChart(datosConfirmados, ctxConfirmados)
    totalFallecidosProvinciaChart(datosFallecidos, ctxFallecidos)
}
renderCharts()