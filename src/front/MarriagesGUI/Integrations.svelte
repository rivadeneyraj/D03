<script>
    import Button from "sveltestrap/src/Button.svelte";
    import  {pop} from "svelte-spa-router";
    
    const URL_BASE = "api/v3/global-marriages";
    
/* Las integraciones que se van a realizar son las siguientes:
    Grupo 05  ---> (Cors)      https://sos1920-05.herokuapp.com/api/v1/books-exports
    Grupo 26  ---> (Proxy)      https://sos1920-26.herokuapp.com/api/v2/global-coef
    Grupo 21  ---> (Cors)      https://sos1920-21.herokuapp.com/api/v2/traffic-injuries
    Grupo 01  ---> (Cors)      https://sos1920-01.herokuapp.com/api/v2/emigrants-stats
*/



    
    async function loadGraph(){
    
    const resData = await fetch(URL_BASE);
    let MyData = await resData.json();
    
    let countries = Array.from(new Set(MyData.map((d) => {return d.country+" "+d.year;})));
    let avg_ms = Array.from(new Set(MyData.map((d) => {return d.avg_m;})));
    let avg_wms = Array.from(new Set(MyData.map((d) => {return d.avg_wms;})));
    let marriages = Array.from(new Set(MyData.map((d) => {return d.marriages;})));
    

    //Integracion con el grupo 26 a traves de proxy
    const URL_BASE_grupo_26 = "/api/v3/global-coef";
    const resData_1 = await fetch(URL_BASE_grupo_26);
    console.log("fetch a " + URL_BASE_grupo_26);
    let MyData_1 = await resData_1.json();
    let avg_1 = Array.from(new Set(MyData_1.map((d) => {return d.team;})));
    console.log("Datos equipos Creus:");
    console.log(avg_1);


    //Integracion con el grupo 05 por CORS
    const URL_BASE_grupo_05 = "/api/v1/books-exports";
    const resData_2 = await fetch(URL_BASE_grupo_05);
    console.log("fetch a " + URL_BASE_grupo_05);
    let MyData_2 = await resData_2.json();
    let avg_2 = Array.from(new Set(MyData_2.map((d) => {return d.exp_book;})));
    console.log("Datos libros exportados Diego:");
    console.log(avg_2);


     //Integracion con el grupo 21 por CORS
    const URL_BASE_grupo_21 = "/api/v2/traffic-injuries";
    console.log("fetch a " + URL_BASE_grupo_21);
    const resData_3 = await fetch(URL_BASE_grupo_21);
    let MyData_3 = await resData_3.json();
    let avg_3 = Array.from(new Set(MyData_3.map((d) => {return d.accident;})));
    console.log("Datos accidentes Juan:");
    console.log(avg_3);


     //Integracion con el grupo 01 por CORS
    const URL_BASE_grupo_01 = "/api/v2/emigrants-stats";
    console.log("fetch a " + URL_BASE_grupo_01);
    const resData_4 = await fetch(URL_BASE_grupo_01);
    let MyData_4 = await resData_4.json();
    let avg_4 = Array.from(new Set(MyData_4.map((d) => {return d.em_totals;})));
    console.log("Datos emigrantes Antonio :");
    console.log(avg_4);
    
    


    
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Tasa de suicidio por países.'
        },
        subtitle: {
            text: 'Fuente: <a href="https://es.wikipedia.org/wiki/Anexo:Pa%C3%ADses_por_tasa_de_suicidio">Wikipedia.org</a>'
       
        },
        xAxis: {
            categories: countries,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Suicidios por cada 100.000 personas.',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: 'Personas'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 350,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Hombres',
            data: avg_ms
        }, {
            name: 'Mujeres',
            data: avg_wms
        }, {
            name: 'Matrimonios',
            data: marriages
        }]
    });
    }
    
    </script>
    
    <svelte:head>
        <script src="https://code.highcharts.com/highcharts.js" defer></script>
        <script src="https://code.highcharts.com/modules/series-label.js"  defer></script>
        <script src="https://code.highcharts.com/modules/exporting.js"  defer></script>
        <script src="https://code.highcharts.com/modules/export-data.js"  defer></script>
        <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}" defer></script>
    </svelte:head>
    
    <main>
        <h2>Integraciones con SOS1920</h2>
        <Button color="info" on:click="{pop}">Atrás</Button>
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
                El gráfico de barras muestra un estudio de personas que se han suicidado por cada 100.000 habitantes
                en distintos países.
            </p>
        </figure>
    </main>
    
    <style>
    .highcharts-figure, .highcharts-data-table table {
        min-width: 310px; 
        max-width: 1000px;
        margin: 1em auto;
    }
    
    #container {
        height: 1000px;
    }
    
    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #EBEBEB;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }
    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }
    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }
    .highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
        padding: 0.5em;
    }
    .highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
        background: #f8f8f8;
    }
    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }
    </style>