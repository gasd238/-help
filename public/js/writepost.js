

function getLocation() {
  if (navigator.geolocation) {
    //위치 정보를 얻기
    navigator.geolocation.getCurrentPosition(function (pos) {
      $('#latitude').html(pos.coords.latitude);     // 위도
      $('#longitude').html(pos.coords.longitude); // 경도
    });
    //   $.ajax({
    //     url: 'https://apis.daum.net/local/geo/coord2addr?apikey=faskljalksfjaklfnalksd&longitude=' + longitude + '&latitude=' + latitude + '&inputCoordSystem=WGS84&output=json',
    //     type: 'GET',
    //     cache: false,
    //     context: {},
    //     crossOrigin: true,
    //     success: function(data) {
    //         var jsonObj = $.parseJSON(data);
    //         var contentText = document.getElementById('content');
    //             contentText.innerHTML += "<br>동네 이름 : " + jsonObj.name;
    //             $('#dongne').html(contentText);
    //     },error:function(request,status,error){
    //         alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    //     }
    // });
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(currentPosition, geoError);
    // }
    // else {
    //   w.innerHTML = "지리위치를 지원하지 않는 브라우저 입니다.";
    // }
  }
}
function currentPosition(myPosition) {
  var a = myPosition.coords.latitude + "," + myPosition.coords.longitude;
  var b = "http://maps.googleapis.com/maps/api/staticmap?center=" + a + "&zoom=10&size=480x320&sensor=false";
  document.getElementById("x").innerHTML = "<img src='" + b + "'>";
}
function geoError(myError) {
  switch (myError.code) {
    case myError.PERMISSION_DENIED: w.innerHTML = "사용자가 위치정보 사용요청을 거절하였습니다."
      break;
    case myError.POSITION_UNAVAILABLE: w.innerHTML = "위치 정보가 사용 가능하지 않습니다."
      break; case myError.TIMEOUT: w.innerHTML = "사용자 위치정보를 얻기 위한 요청이 타임아웃 되었습니다."
      break; case myError.UNKNOWN_ERROR: w.innerHTML = "알수 없는 오류가 발생하였습니다."
      break;
  }
}

