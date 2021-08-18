/**
 * 
 */

let getCoords = () => {
   return new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition((position) =>{
         resolve(position.coords);         
      });
   })
}

getCoords()
.then(coords=> {
	console.dir(coords);
});


let getLocationWeather = async () => {
	let coords = await getCoords();
	
	let queryString = createQueryString({
		lat:coords.latitude,
		lon:coords.longitude,
		units:'metric',
		lang:'kr',
		appid:'409475aa15c9fbf8d9e660e23bf21153'
	});
	
	let url =`https://api.openweathermap.org/data/2.5/weather?${queryString}`;
	let response = await fetch(url);
	let datas = await response.json();
	
		
	return {
		temp:datas.main.temp,
		loc:datas.name
	}


	
}



let getPhotos = async ()=>{
	
	let prevPhotoLog = localStorage.getItem('bg-log');
	
	//사용자가 처음접근했다면, prevPhotoLog값은 null이다.
	if(prevPhotoLog){
		//다시 객체로 받음
		prevPhotoLog = JSON.parse(prevPhotoLog);
		//현재 아직 만료일자를 충족하지 않았다면
		if(prevPhotoLog.expirationOn > Date.now()){
			return prevPhotoLog.bg;
		}//만료된다면, 통신이 발생하면서 배경이미지 변경
	}

	let photoInfo = await requestPhoto();

	registPhotoLog(photoInfo);
	return photoInfo;

}


let requestPhoto = async () =>{
	let queryString = createQueryString({
		orientation:'landscape',
		query:'landscape'
	});
	
	let url = 'https://api.unsplash.com/photos/random?' + queryString;
	
	
	let response = await fetch(url,{
		headers:{Authorization:'Client-ID 3vJrxCP8CGRxCjw7IrzSWZI8vrEf8eug4E_azIVmGAA'}
	});
	let datas = await response.json();
	/*console.dir(datas);*/
	
	return {
		url : datas.urls.regular,
		desc : datas.description,
		alt_desc:datas.alt_description
	}
	
}


/* 배경 log를 함수로 만들어 저장 */
let registPhotoLog = photoInfo => {
	
	//통신이 끝난 시간
	let expirationDate = new Date();
	//1분지나면 만료된 것으로 임의 지정
	expirationDate = expirationDate.setDate(expirationDate.getDate()+1);
	
	let bgLog = {
		expirationOn : expirationDate,
		bg : photoInfo
	}
	
	//storage에 JSON문자열로 변환(stringify)하여 저장
	localStorage.setItem('bg-log',JSON.stringify(bgLog));
}


/* 배경이미지 관련 이미지 및 텍스트 화면에 띄워주는 함수 */
let renderBackground = async () => {
	
	//위치와 날씨정보를 받아온다.
	let locationWeather = await getLocationWeather();
	//화면에 위치와 날씨정보를 그려준다.
	document.querySelector('.txt_location').innerHTML = `${locationWeather.temp}º @${locationWeather.loc}`;

	//배경에 넣을 이미지를 받아온다.
	let background = await getPhotos();
	//배경에 이미지와 이미지정보를 그려준다.
	document.querySelector('body').style.backgroundImage = `url(${background.url})`;
	
	if(background.desc){
		document.querySelector('.txt_bg').innerHTML = background.desc;
	}else{
		document.querySelector('.txt_bg').innerHTML = background.alt_desc;
	}
}

renderBackground();