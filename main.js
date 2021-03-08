"use strict";

// var strict = ( function () { return !!!this } ) ()

// if ( strict ) {
//     console.log ( "strict mode enabled, strict is " + strict )
// } else {
//     console.log ( "strict mode not defined, strict is " + strict )
// }

let icons = {
    users: 'fa fa-users',
    user_times: 'fa fa-user-times',
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

// let lightLayer = 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}';
let lightLayer = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const darkIcon = '🌛';
const lightIcon = '☀️';
const filterDark = ['invert:100%'];
const filterLight = [];
let currentFilter = [];
let btnIcon = lightIcon;
var map = null;
const leafletAtributionGoogle = '&copy; <a target=_blank" href="https://www.google.com/intl/es-419_ec/help/terms_maps/">Google Maps</a>';
const leafletAtributionOpenStreetMap = '&copy; <a href="https://www.openstreetmap.org/copyright">Gracias a OpenStreetMap</a>';
const initialCoords = [-0.43388488653277457, -83.42887136874998];

let loading = document.querySelector('.loading-container');
let contenido = document.querySelector('.contenido-cargado');
let defaultFontFamily = `'Raleway', 'sans-serif'`;
let defaultFontColor = 'white';


window.document.addEventListener('DOMContentLoaded', function (event) {
    loading.classList.add('d-none')
    contenido.classList.remove('d-none')
});

function getEstadisticasIcon(property) {
    let icon;
    switch (property) {
        case 'estables_aislamiento_domiciliario':
            icon = icons.users;
            break;
        case 'hospitalizados_estables':
            icon = icons.termometer;
            break;
        case 'hospitalizados_pronostico_reservado':
            icon = icons.ambulance;
            break;
        case 'casos_con_alta_hospitalaria':
            icon = icons.ambulance;
            break;
        case 'confirmados':
            icon = icons.check;
            break;
        case 'casos_confirmados_con_pruebas_pcr':
            icon = icons.check;
            break;
        case 'fallecidos':
            icon = icons.user_times;
            break;
        case 'fallecidos_por_covid_19':
            icon = icons.user_times;
            break;
        case 'sospechosos':
            icon = icons.question;
            break;
        case 'descartados':
            icon = icons.times;
            break;
        case 'casos_descartados':
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
        case 'muestras_para__rt_pcr':
            icon = icons.users;
            break;
        default:
            icon = icons.default;
            break;

    }
    return icon;
}


const capitalize = (value) => {
    return value.replace(/(?:^|\s)\S/g, function (word) { return word.toUpperCase(); });
}

async function getApiDataOwn(url) {
    try {
        const response = await axios.get(url)
        const data = await response.data;
        return data;
    } catch (err) {
        return { data: [], code: 500 }
    }
}
async function getDataProvince() {
    // const url = "https://coronavirusec-api-gujcv6lav.vercel.app/api/provinces";
    const url = "https://coronavirusec-api.herokuapp.com/api/provinces";
    return await getApiDataOwn(url);
}

async function getDataGeneral() {
    // const url = "https://coronavirusec-api-gujcv6lav.vercel.app/api/provinces";
    const url = "https://coronavirusec-api.herokuapp.com/api";
    return await getApiDataOwn(url);
}

function buildInitialMap() {
    //Crear Mapa
    map = L.map('map', {
        zoomAnimation: false,
        markerZoomAnimation: false,
        zoomControl: true,
        gestureHandling: true
    }).setView(initialCoords, 6, { animation: true });
    const bounds = new L.LatLngBounds([[initialCoords], [initialCoords]]);
    map.fitBounds(bounds)
    map.spin(true, {
        top: '50%',
        left: '50%',
        className: "spinner spinner-leaflet-map",
    });
    map.gestureHandling.enable();
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
    map.invalidateSize();
    L.marker(initialCoords)
        .bindPopup("Punto Central")
        .on('add', function () {
            const bounds = new L.LatLngBounds([[initialCoords], [initialCoords]]);
            map.fitBounds(bounds)
            map.setView(initialCoords, 6, { animation: true });
        })
        .addTo(map);
}

async function main() {
    buildInitialMap();
    let coronavirusData = await getDataGeneral();
    let coronavirusProvince = await getDataProvince();
    buildMapa(coronavirusProvince.data);
    buildGlobalStadistics(coronavirusData.data);
    buildCharts(coronavirusProvince.data);
}



async function getData() {
    const response = await fetch('./db.json')
    const data = await response.json()
    return data;
}

function bindEvents() {
    window.document.addEventListener('DOMContentLoaded', function (event) {
        loading.classList.add('d-none')
    });
}

function buildGlobalStadistics(data) {
    const seccionEstadisticasContent = document.querySelector('.seccion-estadisticas-generales .content');
    const estadisticasData = data;
    if (data.length > 0) {
        while (seccionEstadisticasContent.firstChild) {
            seccionEstadisticasContent.removeChild(seccionEstadisticasContent.firstChild);
        }
    }
    let articleFragmento = document.createDocumentFragment();
    for (const prop in estadisticasData) {
        const valor_prop = estadisticasData[prop];
        const key_prop = Object.keys(valor_prop)[0];
        const valor = valor_prop[key_prop]
        if (key_prop == 'fecha_corte' || key_prop == 'sospechosos' || key_prop == 'casos_confirmados_con_pruebas_pcrcasos_con_alta_hospitalariafallecidos_por_covid-19recuperadosmuestras_para__rt-pcrcasos_descartados') {
            //break;
            continue;
        }
        const icon_prop = key_prop.split('-').join('_');
        const title = key_prop.split('_').join(' ').split('-').join(' ');
        const titleCapitalize = capitalize(title)

        const icon = getEstadisticasIcon(icon_prop);
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
    seccionEstadisticasContent.appendChild(articleFragmento);
    // if(dt)
}

const toggleThemeMode = () => {
    const mode = getThemeMode();
    if (mode == 'light') {
        setThemeMode('dark');
    } else {
        setThemeMode('light');
    }
}

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

//Mapa
function buildMapa(data) {


    //Funciones Manejar Temas
    

    


    //Verificar Modo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matchess) {
        localStorage.setItem('sm-mode-theme', 'dark');
    }

    if (localStorage.getItem("sm-mode-theme") == null) {
        localStorage.setItem('sm-mode-theme', 'light');
    }


    currentFilter = (getThemeMode() == 'light') ? filterLight : filterDark;

    //Función renderizar datos
    function renderExtraData({ provincia, confirmados, fallecidos }) {
        return (`
            <div class="map-info-popup">
              <p class="provincia"> <strong>${provincia}</strong> </p>
              <p class="confirmados"> 
                <span><i class="${icons.check} icon-confirmados" aria-hidden="true"></i> Confirmados </span><span>${confirmados}</span>
              </p>
              <p class="fallecidos"> 
                <span><i class="${icons.frown} icon-fallecidos" aria-hidden="true"></i> Fallecidos </span><span>${fallecidos}</span> 
              </p>
              <p class="fallecidos-probables"> 
                <span><i class="${icons.exclamation} icon-fallecidos-probables" aria-hidden="true"></i> Fallecidos Problables </span><span>${fallecidos}</span> 
              </p>
            </div>
          `)
    }

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
        const provincias = data;
        for (let index_prov = 0; index_prov < provincias.length; index_prov++) {
            const item = provincias[index_prov];
            L.marker([item.latitude, item.longitude], { icon: icon })
                .bindPopup(renderExtraData(item))
                .addTo(map);
        }
    }
    //Ejecutar la función Inicial
    renderData();
    map.invalidateSize();
    map.spin(false);
}

function buildCharts(data) {
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

    async function getConfirmadosPorProvincia(data) {
        const provinciasOrdenadas = _.orderBy(data, prov => prov.confirmados, ['desc'])
        return provinciasOrdenadas;
    }
    async function getFallecidosPorProvincia(data) {
        const provinciasOrdenadas = _.orderBy(data, prov => prov.fallecidos, ['desc'])
        return provinciasOrdenadas;
    }
    async function getConfirmadosRangoEdades(data) {
        const rangoEdadesOrdenados = _.orderBy(data.rango_edades, prov => prov.casos, ['desc'])
        return rangoEdadesOrdenados;
    }

    function getRandomColor(format = 'rgba') {
        return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
    }


    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function totalConfirmadosProvinciaChart(data, ctx) {
        let customLabels = [];
        let customData = [];
        let colors = [];
        data.forEach(province => {
            if (province.confirmados > 0) {
                customLabels.push(`${province.provincia}-${province.confirmados}`);
                customData.push(province.confirmados);
                colors.push(getRandomColor())
            }
        });
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: customLabels,
                datasets: [{
                    data: customData,
                    backgroundColor: colors
                }],
            },
            options: defaultChartOptions
        });
    }

    function totalFallecidosProvinciaChart(data, ctx) {
        let customLabels = [];
        let customData = [];
        let colors = [];
        data.forEach(province => {
            if (province.fallecidos > 0) {
                customLabels.push(`${province.provincia}-${province.fallecidos}`);
                customData.push(province.fallecidos);
                colors.push(getRandomColor())
            }
        });
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: customLabels,
                datasets: [{
                    data: customData,
                    backgroundColor: colors
                }],

            },
            options: defaultChartOptions
        });
    }


    function totalConfirmadosPorGeneroChart(data, ctx) {
        let customLabels = [];
        let customData = [];
        let colors = [];
        data.forEach(genero => {
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
        data.forEach(rango_edades => {
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
        const chatConfirmadosDOM = document.querySelector('#chartConfirmados');
        const chatFallecidosDOM = document.querySelector('#chartFallecidos');
        const ctxConfirmados = chatConfirmadosDOM.getContext('2d')
        const ctxFallecidos = chatFallecidosDOM.getContext('2d');

        if (data.length > 0) {
            document.querySelector(".chart-no-data").remove();
            document.querySelector(".charts-data").classList.remove('d-none');
        } else {
        }

        // const ctxGeneros = document.querySelector('#chartGeneros').getContext('2d');
        // const ctxRangoEdades = document.querySelector('#chartRangoEdades').getContext('2d');
        // const data = await getData();
        //Mapear Datos
        const datosConfirmados = await getConfirmadosPorProvincia(data);
        const datosFallecidos = await getFallecidosPorProvincia(data);
        // const datosRangoEdades = await getConfirmadosRangoEdades(data);
        //Graficos
        totalConfirmadosProvinciaChart(datosConfirmados, ctxConfirmados)
        totalFallecidosProvinciaChart(datosFallecidos, ctxFallecidos)
        // totalConfirmadosPorGeneroChart(data.generos, ctxGeneros);
        // totalRangoEdadesChart(datosRangoEdades, ctxRangoEdades);
    }
    renderCharts()
}




main();

