async function getData() {
    const response = await fetch('../db.json')
    const data = await response.json()
    return data
}

async function getConfirmadosPorProvincia(data) {
    const provinciasOrdenadas = _.orderBy(data.provincias, prov => prov.confirmados, ['desc'])
    return provinciasOrdenadas;
}
async function getFallecidosPorProvincia(data) {
    const provinciasOrdenadas = _.orderBy(data.provincias, prov => prov.fallecidos, ['desc'])
    return provinciasOrdenadas;
}
async function getConfirmadosRangoEdades(data) {
    const rangoEdadesOrdenados = _.orderBy(data.rango_edades, prov => prov.casos, ['desc'])
    return rangoEdadesOrdenados;
}

function getRandomColor(format = 'rgba') {
    return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
  }
  

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
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


function totalConfirmadosPorGeneroChart(data, ctx) {  
    let customLabels = [];
    let customData = [];
    let colors = [];
    data.forEach(genero =>{
            customLabels.push(capitalize(genero.sexo));
            customData.push(genero.casos);
            colors.push(getRandomColor())
        
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
                text: 'Casos Confirmados por Genero en Ecuador por Provincia COVID-19',
                fontSize: 20,
                padding: 10,
                fontColor: '#12619c',
            },
            responsive: false, 
        }
    })
}
function totalRangoEdadesChart(data, ctx) {  
    let customLabels = [];
    let customData = [];
    let colors = [];
    data.forEach(rango_edades =>{
            customLabels.push(capitalize(rango_edades.tipo));
            customData.push(rango_edades.casos);
            colors.push(getRandomColor())
        
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
                text: 'Casos Confirmados por Genero en Ecuador por Provincia COVID-19',
                fontSize: 20,
                padding: 10,
                fontColor: '#12619c',
            },
            responsive: false, 
        }
    })
}

async function renderCharts() {
    //Referencia a los charts
    const ctxConfirmados = document.querySelector('#chartConfirmados').getContext('2d')
    const ctxFallecidos = document.querySelector('#chartFallecidos').getContext('2d');
    const ctxGeneros = document.querySelector('#chartGeneros').getContext('2d');
    const ctxRangoEdades= document.querySelector('#chartRangoEdades').getContext('2d');
    const todosDatos = await getData();
    //Mapear Datos
    const datosConfirmados = await getConfirmadosPorProvincia(todosDatos);
    const datosFallecidos = await getFallecidosPorProvincia(todosDatos);
    const datosRangoEdades = await getConfirmadosRangoEdades(todosDatos);
    //Graficos
    totalConfirmadosProvinciaChart(datosConfirmados, ctxConfirmados)
    totalFallecidosProvinciaChart(datosFallecidos, ctxFallecidos)
    totalConfirmadosPorGeneroChart(todosDatos.generos, ctxGeneros);
    totalRangoEdadesChart(datosRangoEdades, ctxRangoEdades);
}
renderCharts()