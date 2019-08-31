document.write("<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBmuPitVOQ-Xrx3789VhQYg3D1kc42JoDI'></script>");
function getLocation() {
  if (navigator.geolocation) {
  //위치 정보를 얻기
  navigator.geolocation.getCurrentPosition(function (pos) {
  $('#latitude').val(pos.coords.latitude);     // 위도
  $('#longitude').val(pos.coords.longitude); // 경도   
  var cords = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
  var geocoder =  new google.maps.Geocoder();
  geocoder.geocode({'latLng' : cords}, function(results, status) {
      if (results[1])
      {
      $('#dogne').val(results[1].formatted_address);
      }
  });   
  });
}else{
  alert("위치 정보를 지원하지 않습니다.");
  }
};