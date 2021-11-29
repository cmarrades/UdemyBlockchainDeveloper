//import sha256 from 'crypto-js/sha256';
var sha256 = require("crypto-js/sha256");

function generateHash(obj)
{
	var json = JSON.stringify(obj)
    var hash = sha256(json);
	
    console.log(hash.toString());
}

const data1 = "Blockchain Rock!";
const dataObject = {
	id: 1,
  	body: "With Object Works too",
  	time: new Date().getTime().toString().slice(0,-3)
};

generateHash(dataObject);