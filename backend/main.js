var express = require('express');
var app = express();

app.get('/', function (req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
      user: 'sa',
      password: 'mypassword',
      server: 'localhost',
      database: 'SchoolDB'
    };

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query(queryBuilder(JSON.parse(req.query.item)), function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.json({
              data : recordset
            });

        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

function queryBuilder(item) {
  var query =
    "select  distinct  R.uprole_code ,R.role_code,p.partner_code,p.name as name,p.streetname1,p.itinerary_code,pp.name as typo from partner p inner join role_itinerary ri on p.itinerary_code=ri.itinerary_code inner join role r on ri.role_code=r.role_code inner join saleschannel pp on p.saleschannel_code=pp.saleschannel_code inner join sinvoice s on r.role_code=s.role_code where";
    console.log(item)
  if (item.upRole) {
    query += ' r.uprole_code = ' + item.upRole.toString().trim();
  }
  if (item.role) {
    query += ' r.role_code = ' + item.role.toString().trim();

  }
   if (item.d1) {
    var dd1 = new Date(item.d1).toISOString().slice(0, 19).split('T')[0];
    if (item.d2) {
      var dd2 = new Date(item.d2).toISOString().slice(0, 19).split('T')[0];

      query += ' AND S.THEDATE BETWEEN ' + dd1 + ' AND ' + dd2;
    } else {
      query += ' AND S.THEDATE = ' + dd1;
    }
  }
   if (item.ca) {
    query += ' AND S.AMOUNT/COUNT(DISTINCT SINVOICE_CODE)> ' + item.ca.toString().trim();

  }
  if (item.typology) {
    query += ' AND pp.name = ' + item.typology.toString().trim();

  }
  return query;
}
