import "xhr";

d4.json = function(url, callback) {
  return d4_xhr(url, "application/json", d4_json, callback);
};

function d4_json(request) {
  return JSON.parse(request.responseText);
}
