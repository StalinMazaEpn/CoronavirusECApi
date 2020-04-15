let icons = {
    users: 'fa fa-users',
    user: 'fa fa-user',
    frown: 'fa fa-frown-o',
    heartbeat: 'fa fa-heartbeat',
    medkit: 'fa fa-medkit',
    ambulance: 'fa fa-ambulance',
    check: 'fa fa-check-square',
    exclamation: 'fa fa-exclamation-triangle',
    question: 'fa fa-question-circle',
    termometer: 'fa fa-thermometer-full',
    times: 'fa fa-times',
    bullseye: 'fa fa-bullseye',
    default: ''
};

let loading = document.querySelector('.loading-container');
let contenido = document.querySelector('.contenido-cargado');
let defaultFontFamily = `'Raleway', 'sans-serif'`;
let defaultFontColor = 'white';


window.document.addEventListener('DOMContentLoaded', function(event){
    loading.classList.add('d-none')
    contenido.classList.remove('d-none')
});

function getEstadisticasIcon(property){
    let icon;
    switch(property){
        case 'estables_aislamiento_domiciliario':
            icon = icons.users;
            break;
        case 'hospitalizados_estables':
            icon = icons.termometer;
            break;
        case 'hospitalizados_pronostico_reservado':
            icon = icons.ambulance;
            break;
        case 'confirmados':
            icon = icons.check;
            break;
        case 'fallecidos':
            icon = icons.frown;
            break;
        case 'sospechosos':
            icon = icons.question;
            break;
        case 'descartados':
            icon = icons.times;
            break;
        case 'recuperados':
            icon = icons.medkit;
            break;
        case 'muestras_tomadas':
            icon = icons.users;
            break;
        case 'fallecidos_probables':
            icon = icons.bullseye;
            break;
        case 'fecha_corte':
            icon = icons.users;
            break;
        default:
            icon = icons.default;
            break;
            
    }
    return icon;
}


const capitalize = (value) => {
    return value.replace(/(?:^|\s)\S/g, function(word) { return word.toUpperCase(); });
}

async function main(){
    let coronavirusData = await getData();
    // bindEvents();
    buildMapa(coronavirusData);
    buildStadistics(coronavirusData);
    buildCharts(coronavirusData);
}

async function getData() {
    const response = await fetch('./db.json')
    const data = await response.json()
    return data
}

function bindEvents(){
    window.document.addEventListener('DOMContentLoaded', function(event){
        loading.classList.add('d-none')
    });
}

function buildStadistics(data){
    const seccionEstadisticasContent = document.querySelector('.seccion-estadisticas-generales .content');;
    const estadisticasData = data.estadisticas;
    let articleFragmento = document.createDocumentFragment();
    for (const prop in estadisticasData) {
        //const title = prop.replace('_', ' ');
        const title = prop.split('_').join(' '); 
        const valor = estadisticasData[prop];
        const titleCapitalize = capitalize(title)
        if(prop == 'fecha_corte' || prop == 'sospechosos'){
            //break;
            continue;
        }
        const icon = getEstadisticasIcon(prop);
        let articulo = document.createElement("article");
        articulo.classList.add('general');
        // articulo.classList.add('confirmed');
        const htmlArticulo = `
        <span class="icon">
        <i class="${icon}" aria-hidden="true"></i>
        </span>
        <span class="subtitle">${valor}</span>
        <span class="content">${titleCapitalize}</span>
        `;
        articulo.innerHTML = htmlArticulo;
        articleFragmento.appendChild(articulo);
    }
    seccionEstadisticasContent.appendChild(articleFragmento)
}

//Mapa
function buildMapa(data) {
    let lightLayer = 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}';
    const darkIcon = '🌛';
    const lightIcon = '☀️';
    const filterDark = ['invert:100%'];
    const filterLight = [];
    let currentFilter = [];
    let btnIcon = lightIcon;
    const leafletAtributionGoogle = '&copy; <a target=_blank" href="https://www.google.com/intl/es-419_ec/help/terms_maps/">Google Maps</a>';
    const leafletAtributionOpenStreetMap = '&copy; <a href="https://www.openstreetmap.org/copyright">Gracias a OpenStreetMap</a>';
    const initialCoords = [-1.618322, -80.779271];

    //Funciones Manejar Temas
    const getThemeMode = () => {
        const mode = localStorage.getItem('sm-mode-theme');
        if (!mode) {
            return 'light'
        } else {
            return mode;
        }
    }

    const setThemeMode = (mode) => {
        localStorage.setItem('sm-mode-theme', mode);
    }

    const toggleThemeMode = () => {
        const mode = getThemeMode();
        if (mode == 'light') {
            setThemeMode('dark');
        } else {
            setThemeMode('light');
        }
    }


    //Verificar Modo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matchess) {
        localStorage.setItem('sm-mode-theme', 'dark');
    }

    if (localStorage.getItem("sm-mode-theme") == null) {
        localStorage.setItem('sm-mode-theme', 'light');
    }


    currentFilter = (getThemeMode() == 'light') ? filterLight : filterDark;



    //Crear Mapa
    var map = L.map('map', {
        zoomAnimation: false,
        markerZoomAnimation: false,
        zoomControl: true,
    }).setView(initialCoords, 7, { animation: true });
    //Añadirle una capa
    let mapTileLayer = L.tileLayer.colorFilter(lightLayer, {
        attribution: leafletAtributionGoogle,
        updateWhenIdle: true,
        reuseTiles: true,
        filter: currentFilter,
    }).addTo(map);


    // Añadir boton FullScreen
    var fsControl = L.control.fullscreen();
    map.addControl(fsControl);

    //Añadir Boton Modo Tema
    let btnThemeControl = L.control();
    btnThemeControl.onAdd = function (map) {
        let container = L.DomUtil.create('input');
        container.type = "button";
        container.value = btnIcon;
        container.title = "Modo Visualización";
        //Funcion cuando hagan click en el boton de toggle Mode
        container.onclick = function (event) {
            toggleThemeMode();
            //Cambiar Boton, Clase y Filtro de Mapa
            if (getThemeMode() == 'light') {
                event.target.value = lightIcon;
                event.target.classList.remove('dark');
                mapTileLayer.updateFilter(filterLight);
            } else {
                event.target.value = darkIcon;
                mapTileLayer.updateFilter(filterDark);
                event.target.classList.add('dark');
            }
        }
        container.classList.add('btnThemeControl')
        return container;
    };
    btnThemeControl.addTo(map);

    //Función renderizar datos
    function renderExtraData({ nombre, confirmados, fallecidos }) {
        return (`
            <div class="map-info-popup">
              <p class="provincia"> <strong>${nombre}</strong> </p>
              <p class="confirmados"> 
                <span><i class="${icons.check} icon-confirmados" aria-hidden="true"></i> Confirmados </span><span>${confirmados}</span>
              </p>
              <p class="fallecidos"> 
                <span><i class="${icons.frown} icon-fallecidos" aria-hidden="true"></i> Fallecidos </span><span>${fallecidos}</span> 
              </p>
            </div>
          `)
    }
    //Añador Titulo Información
    // var info = L.control({position:'bottomcenter'});
    // info.onAdd = function (map) {
    //     this._div = L.DomUtil.create('div', 'info');
    //     this.update();
    //     return this._div;
    // };
    // info.update = function (props) {
    //     this._div.innerHTML = '<h4>Mapa Coronavirus en Ecuador</h4>' + '<span>Datos del MSP del Ecuador</span>';
    // };
    // info.addTo(map);

    //Crear Icono
    const iconUrl = './icon.png';
    const shadowIcon = './marker-shadow.png';
    const icon = new L.Icon({
        iconUrl: iconUrl,
        shadowUrl: shadowIcon,
        shadowSize: [40, 40],
        iconSize: [40, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    //Añadir Marcadores
    async function renderData() {
        // const data = await getData();
        const provincias = data.provincias;
        // let markersGroup = [];
        provincias.forEach((item, index) => {
            const marker = L.marker([item.latitude, item.longitude], { icon: icon })
                // .addTo(map)
                .bindPopup(renderExtraData(item))
                .addTo(map);
        });
    }
    //Ejecutar la función Inicial
    renderData()
}

function buildCharts(data){
    let defaultChartOptions = {           
        title: {
            display: false,
            // text: 'Casos Confirmados por Genero en Ecuador por Provincia COVID-19',
            // fontSize: 20,
            // padding: 10,
            // fontColor: '#12619c',
        },
        responsive: true,
        maintainAspectRatio: false,
        // responsiveAnimationDuration: 100
    }
    //Fuente Blanca
    Chart.defaults.global.defaultFontColor = defaultFontColor;
    // Chart.defaults.global.defaultFontFamily = defaultFontFamily;

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
                customLabels.push(`${province.nombre}-${province.confirmados}`);
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
            options: defaultChartOptions
        })
    }
    
    function totalFallecidosProvinciaChart(data, ctx) {  
        let customLabels = [];
        let customData = [];
        let colors = [];
        data.forEach(province =>{
            if(province.fallecidos > 0){
                customLabels.push(`${province.nombre}-${province.fallecidos}`);
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
            options: defaultChartOptions
        })
    }
    
    
    function totalConfirmadosPorGeneroChart(data, ctx) {  
        let customLabels = [];
        let customData = [];
        let colors = [];
        data.forEach(genero =>{
                customLabels.push(capitalize(`${genero.sexo}-${genero.casos}`));
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
            options: defaultChartOptions
        })
    }
    function totalRangoEdadesChart(data, ctx) {  
        let customLabels = [];
        let customData = [];
        let colors = [];
        data.forEach(rango_edades =>{
                customLabels.push(`${capitalize(rango_edades.tipo)}-${rango_edades.casos}`);
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
            
            options: defaultChartOptions
        })
    }
    
    async function renderCharts() {
        //Referencia a los charts
        const ctxConfirmados = document.querySelector('#chartConfirmados').getContext('2d')
        const ctxFallecidos = document.querySelector('#chartFallecidos').getContext('2d');
        const ctxGeneros = document.querySelector('#chartGeneros').getContext('2d');
        const ctxRangoEdades= document.querySelector('#chartRangoEdades').getContext('2d');
        // const data = await getData();
        //Mapear Datos
        const datosConfirmados = await getConfirmadosPorProvincia(data);
        const datosFallecidos = await getFallecidosPorProvincia(data);
        const datosRangoEdades = await getConfirmadosRangoEdades(data);
        //Graficos
        totalConfirmadosProvinciaChart(datosConfirmados, ctxConfirmados)
        totalFallecidosProvinciaChart(datosFallecidos, ctxFallecidos)
        totalConfirmadosPorGeneroChart(data.generos, ctxGeneros);
        totalRangoEdadesChart(datosRangoEdades, ctxRangoEdades);
    }
    renderCharts()
}




main();

