let renderCurrentTime = () => {
	
	let now = new Date();
	let hour = now.getHours();
	let min = now.getMinutes();
	let sec = now.getSeconds();
	
	hour = hour < 10 ? "0"+hour : hour;
	min = min < 10 ? "0"+min : min;
	sec = sec < 10 ? "0"+sec : sec;
	document.querySelector('.txt_clock').innerHTML=`${hour}시 ${min}분 ${sec}초`;
	
}

let renderUser = (event) => {
	//html요소의 기본 이벤트 중지
	event.preventDefault();
	
	let input = document.querySelector('.inp_username').value;
	localStorage.setItem('username',input);
	convertMainDiv(input);
}

let registSchedule = (event) => {
	//html요소의 기본 이벤트 중지
	event.preventDefault();
	
	/* 사용자가 이전에 등록한 todo정보가 있는지 */
	let prevTodo = localStorage.getItem('todo');
	
	/* 사용자가 입력한 todo값을 저장 */
	let input = document.querySelector('.inp_todo').value;

	let todoList = [];
	
	if(prevTodo){
		todoList = JSON.parse(prevTodo);
		/* 값을 식별하기 위해 idx값을 인위적으로 넣어주자 */
		let idx = Number(localStorage.getItem('lastIdx')) + 1;
		localStorage.setItem('lastIdx',idx);
		todoList.unshift({work:input, idx:idx});
	}else{
		localStorage.setItem('lastIdx',0);
		todoList.unshift({work:input, idx:0});
	}
	
	localStorage.setItem('todo',JSON.stringify(todoList));
	/* 첫화면에 8번인덱스까지만 출력 */
	renderSchedule(todoList.slice(0,8));
}

let removeSchedule = event => {
	let currPage = Number(document.querySelector('#currentPage').textContent);
	let todoList = JSON.parse(localStorage.getItem('todo'));
	/*console.dir(todoList);*/
	let removedList = todoList.filter(e => {
		return event.target.dataset.idx != e.idx;
	})
	
	console.dir(removedList);
	localStorage.setItem('todo',JSON.stringify(removedList));
	
	let end = currPage * 8;
	let begin = end - 8;
	renderSchedule(removedList.slice(begin,end));
}


let renderSchedule = (todoList) => {

	/* 입력 및 저장된 todoList 배열 초기화 작업 */
	document.querySelectorAll('.todo-list>div').forEach(e => {e.remove()});
	
	/* input입력창 초기화 */
	document.querySelector('.inp_todo').value='';
	
	todoList.forEach(schedule => {
		/* 새로운 div를 만들어 값입력 + 스타일 변경 */
		let workDiv = document.createElement('div');
		workDiv.innerHTML = `<i class="far fa-trash-alt" data-idx="${schedule.idx}"></i> ${schedule.work}`;
		document.querySelector('.todo-list').append(workDiv);
	})
	
	document.querySelectorAll('.todo-list>div>i').forEach(e=>{
		e.addEventListener('click',removeSchedule)
	})
}

let renderPagination = (event) => {
	
	let dir = Number(event.target.dataset.dir);
	
	//1. 현재 페이지
	let currPage = Number(document.querySelector('#currentPage').textContent);	/* 텍스트 노드값들이 담기는 곳 textContent속성 */
	let lastPage;
	let renderPage = currPage + dir;	//dir; 1 or -1
	
	//2. 전체 페이지 수
	let todoList = localStorage.getItem('todo');
	
	if(todoList){
		todoList = JSON.parse(todoList);
		let todoCnt = todoList.length;
		lastPage = Math.ceil(todoCnt/8);		/* 콘텐츠 수가 87일 때 한페이지에 8콘텐츠를 보여준다면 필요한 페이지 수는 11*/
	}
	
	//3. 페이지 당 뿌릴 데이터 수
	if(renderPage > lastPage){
		alert('마지막 페이지입니다.');
		return;
	}
	
	if(renderPage < 1){
		alert('이전 페이지가 없습니다.');
		return;
	}
	
	
	let end = renderPage * 8;		//뿌려줘야할 데이터 수 = (현재페이지+1) * 8
	let begin = end - 8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('#currentPage').textContent = renderPage;
}

/*
let renderNextPage = () => {
	//1. 현재 페이지
	let currPage = Number(document.querySelector('#currentPage').textContent);	 //텍스트 노드값들이 담기는 곳 textContent속성 
	
	let lastPage;
	//2. 전체 페이지 수
	let todoList = localStorage.getItem('todo');
	if(todoList){
		todoList = JSON.parse(todoList);
		let todoCnt = todoList.length;
		lastPage = Math.ceil(todoCnt/8);		 //콘텐츠 수가 87일 때 한페이지에 8콘텐츠를 보여준다면 필요한 페이지 수는 11
	}
	
	//3. 페이지 당 뿌릴 데이터 수
	if(currPage == lastPage){
		alert('마지막 페이지입니다.');
		return;
	}
	
	let renderPage = currPage+1;
	let end = renderPage * 8;		//뿌려줘야할 데이터 수 = (현재페이지+1) * 8
	let begin = end - 8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('#currentPage').textContent = renderPage;
}


let renderPrevPage = () => {
	//현재페이지
	let currPage = Number(document.querySelector('#currentPage').textContent);
	
	let todoList = localStorage.getItem('todo');
	if(todoList){	//JSON은 NULL을 파싱할 수 없으므로 todoList배열이 존재할 때만 파싱처리
		todoList = JSON.parse(todoList);
	}
	
	let renderPage = currPage -1;
	
	if(renderPage == 0){
		alert('이전 페이지가 없습니다.');
		return;
	}
	let end = renderPage * 8;
	let begin = end - 8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('#currentPage').textContent = renderPage;
	
}

*/

let convertMainDiv = (username) => {
	document.querySelector('.username').innerHTML = username;
	document.querySelector('.inp_username').placeholder = 'Enter Your Schedule';
	document.querySelector('.inp_username').value = '';
	
	document.querySelector('.wrap_username').className = 'todo';
	document.querySelector('.frm_username').className = 'frm_todo';
	document.querySelector('.inp_username').className = 'inp_todo';

	document.querySelector('.main').style.justifyContent = 'space-between';
	document.querySelector('.wrap_todo').style.marginRight = '20vw';
	document.querySelector('.todo-list').style.display = 'block';
	
	//기존에 등록한 submit 이벤트 제거
	document.querySelector('.frm_todo').removeEventListener('submit',renderUser);
		
	document.querySelector('.frm_todo').addEventListener('submit',registSchedule);
	document.querySelector('#leftArrow').addEventListener('click',renderPagination);
	document.querySelector('#rightArrow').addEventListener('click',renderPagination);

}

/* 전체적인 흐름 관리 및 전역 변수 보호 */
(() => {
	/* 있으면 해당 값 반환, 없으면 null */
	let username  = localStorage.getItem('username');
	let todoList = localStorage.getItem('todo');
	
	if(username){	//사용자가 본인이름 등록에 성공했다면 placeholder값과 username html이 변경되어야함
		convertMainDiv(username);
		
		/* 바로 저장된 이전데이터를 가져와 시작화면부터 뿌려줌 */
		if(todoList){
			todoList = JSON.parse(todoList);
			/* 첫화면에 8번인덱스까지만 출력 */
			renderSchedule(todoList.slice(0,8));
			
		}
	
	}else{
		document.querySelector('.frm_username').addEventListener('submit',renderUser);
	}
	
	setInterval(renderCurrentTime,1000);

})();


