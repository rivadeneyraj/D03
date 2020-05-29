<script>
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

async function drawChart() {

    const BASE_API_URL = "/api/v3/global-marriages";

    const resData = await fetch(BASE_API_URL);
    let MyData = await resData.json();   
    console.log(MyData)

    /* Getting the countries */
    let countries = Array.from(new Set(MyData.map((d) => {return d.country;})));
    /* Mapping the data in the right format */
    /* The country must be an index of the array of countries */
    /*  
    Turning this:

    {
        "country": "Country",
        "marriages": 0.0,
        "year": 2000,
    }

    into this:

    ["Country", 0.0 ,2000]
    The first 0 is the index of "Country" in the array of countries

    */
    MyData =await MyData.map((d) => {
        return [d.country, d.marriages,d.year]; 
    });

    let DataTypes = [["Country", "Marriages","Year"]]

    Array.prototype.push.apply(DataTypes,MyData)

 

    console.log("***********")
    console.log(DataTypes)

  var data = google.visualization.arrayToDataTable(DataTypes);

  var options = {
    title: 'Matrimonios registrados a nivel global'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}
</script>

<html lang="EN">
    <div id="piechart"></div>
</html>
  