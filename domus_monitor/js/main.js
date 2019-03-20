var burgBut = document.querySelector("#burgBut");
var burgMenu = document.querySelector("#burgMenu");
	
	//functions

function burgbut() {
		burgMenu.classList.toggle("slideToggle");
		console.log('clicked');
}
	
	//listeners

burgBut.addEventListener("click", burgbut, false);