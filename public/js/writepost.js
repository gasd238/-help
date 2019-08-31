function getLocation() {
  if (navigator.geolocation) {
    //위치 정보를 얻기
    navigator.geolocation.getCurrentPosition(function (pos) {
      $('#latitude').html(pos.coords.latitude);     // 위도
      $('#longitude').html(pos.coords.longitude); // 경도
    });
  }
  else{
    alert("위치 정보를 지원하지 않습니다.");
  }
}

